/**
 * SkyCast - Advanced Weather Intelligence Platform Framework Module
 */

const API_KEY = "e122cf405c1e41b396a180035261606"; // WeatherAPI.com Cryptographic Key Token
const BASE_URL = "https://api.weatherapi.com/v1";

// Memory Architecture & Local Storage States Engine
let platformState = {
    theme: localStorage.getItem('skycast_theme') || 'dark',
    recents: JSON.parse(localStorage.getItem('skycast_recents')) || [],
    favorites: JSON.parse(localStorage.getItem('skycast_favorites')) || [],
    cachedWeatherData: null,
    radarMapInstance: null,
    radarMarkerInstance: null,
    activeCharts: {},
    clockIntervalToken: null,
    speechRecognitionEngine: null
};

// UI Cache Grid Node Selectors Injection
const dom = {
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    voiceSearchBtn: document.getElementById('voice-search-btn'),
    geolocationBtn: document.getElementById('geolocation-btn'),
    dashboardSection: document.getElementById('dashboard'),
    loadingState: document.getElementById('loading-state'),
    errorCard: document.getElementById('error-card'),
    errorMessage: document.getElementById('error-message'),
    dashboardGrid: document.getElementById('dashboard-grid'),
    historyChips: document.getElementById('history-chips'),
    searchHistoryContainer: document.getElementById('search-history'),
    favoritesChips: document.getElementById('favorites-chips'),
    favoritesBar: document.getElementById('favorites-bar'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    themeMenuDropdown: document.getElementById('theme-menu'),
    pwaInstallBtn: document.getElementById('pwa-install-btn'),
    backToTopBtn: document.getElementById('back-to-top'),
    globalAlertCenter: document.getElementById('global-alert-center'),
    aiInsightsContent: document.getElementById('ai-insights-content'),
    
    // Core Panel Nodes
    cityName: document.getElementById('city-name'),
    countryName: document.getElementById('country-name'),
    timezoneBadge: document.getElementById('timezone-badge'),
    currentDate: document.getElementById('current-date'),
    currentTime: document.getElementById('current-time'),
    mainTemp: document.getElementById('main-temp'),
    weatherMainIcon: document.getElementById('weather-main-icon'),
    weatherDescription: document.getElementById('weather-description'),
    feelsLikeTemp: document.getElementById('feels-like-temp'),
    conditionText: document.getElementById('condition-text'),
    
    // Core Action Control Triggers
    addFavoriteToggleBtn: document.getElementById('add-favorite-toggle-btn'),
    compareInitBtn: document.getElementById('compare-init-btn'),
    sharePlatformBtn: document.getElementById('share-platform-btn'),
    exportPdfBtn: document.getElementById('export-pdf-btn'),
    
    // Cross-Comparison Targets
    comparisonSection: document.getElementById('comparison-section'),
    comparisonGridTarget: document.getElementById('comparison-grid-target'),
    closeComparisonBtn: document.getElementById('close-comparison-btn'),
    
    // Air Quality Layout Injections
    aqiGaugeNeedle: document.getElementById('aqi-gauge-needle'),
    aqiGaugeVal: document.getElementById('aqi-gauge-val'),
    aqiGaugeStatus: document.getElementById('aqi-gauge-status'),
    valPm25: document.getElementById('val-pm25'),
    valPM10: document.getElementById('val-pm10'), // Upper case M stabilized
    valCo: document.getElementById('val-co'),
    valNo2: document.getElementById('val-no2'),
    valO3: document.getElementById('val-o3'),
    valSo2: document.getElementById('val-so2'),
    
    // Core Atmospheric Metric Highlights Node List
    valHumidity: document.getElementById('val-humidity'),
    descHumidity: document.getElementById('desc-humidity'),
    valWind: document.getElementById('val-wind'),
    descWind: document.getElementById('desc-wind'),
    valPressure: document.getElementById('val-pressure'),
    descPressure: document.getElementById('desc-pressure'),
    valVisibility: document.getElementById('val-visibility'),
    descVisibility: document.getElementById('desc-visibility'),
    valUv: document.getElementById('val-uv'),
    descUv: document.getElementById('desc-uv'),
    valDewpoint: document.getElementById('val-dewpoint'),
    descDewpoint: document.getElementById('desc-dewpoint'),
    valClouds: document.getElementById('val-clouds'),
    descClouds: document.getElementById('desc-clouds'),
    valMoonphase: document.getElementById('val-moonphase'),
    descMoonphase: document.getElementById('desc-moonphase'),
    valRainchance: document.getElementById('val-rainchance'),
    descRainchance: document.getElementById('desc-rainchance'),
    valGust: document.getElementById('val-gust'),
    descGust: document.getElementById('desc-gust'),
    
    // Chrono Visual Components
    solarLiveNode: document.getElementById('solar-live-node'),
    valSunrise: document.getElementById('val-sunrise'),
    valSunset: document.getElementById('val-sunset'),
    hourlyContainer: document.getElementById('hourly-container'),
    forecastContainer: document.getElementById('forecast-container'),
    suggestionsBox: document.getElementById('suggestions-box')
};

// Platform Master Initializer Array
document.addEventListener('DOMContentLoaded', () => {
    applyConfiguredTheme(platformState.theme);
    syncStorageUiComponents();
    attachRuntimeEventListeners();
    initializeVoiceRecognitionEngine();
    registerPlatformServiceWorker();
    
    // Default system boot request sequence using current locale discovery parameters
    triggerGeolocationDiscovery();
});

function attachRuntimeEventListeners() {
    dom.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        executeDataAcquisitionPipeline(dom.searchInput.value.trim());
    });
    
    // Search Autocomplete Suggestion Logic Hooks
    dom.searchInput.addEventListener('input', debounceRuntimeExecution(handleSearchAutocompleteInput, 300));
    dom.searchInput.addEventListener('keydown', handleSearchKeyboardNavigation);
    
    // Theme Dropdown Navigation Actions
    dom.themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dom.themeMenuDropdown.classList.toggle('hidden');
    });
    
    document.querySelectorAll('[data-theme-select]').forEach(btn => {
        btn.addEventListener('click', () => {
            const chosenTheme = btn.getAttribute('data-theme-select');
            applyConfiguredTheme(chosenTheme);
            dom.themeMenuDropdown.classList.add('hidden');
        });
    });
    
    document.addEventListener('click', () => {
        dom.themeMenuDropdown.classList.add('hidden');
        dom.suggestionsBox.classList.add('hidden');
    });

    // Control Utility System Event Hooks
    dom.geolocationBtn.addEventListener('click', triggerGeolocationDiscovery);
    dom.voiceSearchBtn.addEventListener('click', toggleVoiceCapturePipeline);
    dom.addFavoriteToggleBtn.addEventListener('click', toggleCurrentCityBookmarkStatus);
    dom.compareInitBtn.addEventListener('click', initializeComparisonMatrixDialog);
    dom.closeComparisonBtn.addEventListener('click', () => dom.comparisonSection.classList.add('hidden'));
    dom.sharePlatformBtn.addEventListener('click', executeWebShareApiPipeline);
    dom.exportPdfBtn.addEventListener('click', generateHighFidelityPdfReport);
    
    window.addEventListener('scroll', parseWindowScrollStateY);
    dom.backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    // Material Ripple Injection Effect Hook Logic
    document.querySelectorAll('.card-ripple').forEach(btn => {
        btn.addEventListener('click', function(e) {
            let ripple = document.createElement('span');
            ripple.classList.add('ripple-fx');
            this.appendChild(ripple);
            let d = Math.max(this.clientWidth, this.clientHeight);
            ripple.style.width = ripple.style.height = d + 'px';
            ripple.style.left = e.clientX - this.getBoundingClientRect().left - d/2 + 'px';
            ripple.style.top = e.clientY - this.getBoundingClientRect().top - d/2 + 'px';
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Global Core Data Acquisition Telemetry Framework
async function executeDataAcquisitionPipeline(queryLocation) {
    if (!queryLocation) return;
    setDashboardLoadingUI(true);
    clearPlatformAlertCenter();
    
    try {
        const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(queryLocation)}&days=5&aqi=yes&alerts=yes`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error("Target core nodes did not transmit verified telemetric streams.");
        
        const data = await res.json();
        platformState.cachedWeatherData = data;
        
        renderIntelligenceDashboard(data);
        pushCityToRecentsArray(data.location.name);
        updateBookmarkActionControlStatus();
        
    } catch (err) {
        displayTelemetryExceptionCard(err.message);
    } finally {
        setDashboardLoadingUI(false);
    }
}

// Master Render Control Router Engine
function renderIntelligenceDashboard(data) {
    dom.dashboardSection.classList.remove('hidden');
    
    // Identity Parameters Mapping
    dom.cityName.textContent = data.location.name;
    dom.countryName.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location.country}`;
    dom.timezoneBadge.textContent = `TZ: ${data.location.tz_id}`;
    
    // Launch Synchronized Live Micro-Clock Array Core
    launchLiveClockEngine(data.location.localtime, data.location.tz_id);
    
    // Standard Basic Metric Layout Sets
    dom.mainTemp.textContent = Math.round(data.current.temp_c);
    dom.weatherMainIcon.src = `https:${data.current.condition.icon}`;
    dom.weatherMainIcon.alt = data.current.condition.text;
    dom.weatherDescription.textContent = data.current.condition.text;
    dom.feelsLikeTemp.textContent = `${Math.round(data.current.feelslike_c)}°C`;
    dom.conditionText.textContent = `UV scale mapping profile index ${data.current.uv}`;
    
    // Populate Layered Architectural Highlights Layout Elements
    dom.valHumidity.textContent = `${data.current.humidity}%`;
    dom.descHumidity.textContent = data.current.humidity > 60 ? "Elevated condensation ratio." : "Dry localized atmosphere.";
    
    dom.valWind.innerHTML = `${data.current.wind_kph} <small>km/h</small>`;
    dom.descWind.textContent = `Bearing heading vectors: ${data.current.wind_dir}`;
    
    dom.valPressure.innerHTML = `${data.current.pressure_mb} <small>hPa</small>`;
    dom.descPressure.textContent = "Stable localized density reading.";
    
    dom.valVisibility.innerHTML = `${data.current.vis_km} <small>km</small>`;
    dom.descVisibility.textContent = data.current.vis_km >= 10 ? "Clear operational visual threshold." : "Dense suspended particulate layer.";
    
    dom.valUv.textContent = data.current.uv;
    dom.descUv.textContent = data.current.uv >= 6 ? "High risk irradiation profile." : "Safe non-ionizing baseline level.";
    
    const dayForecastZero = data.forecast.forecastday[0];
    dom.valDewpoint.textContent = `${Math.round(dayForecastZero.hour[0].dewpoint_c)}°C`;
    dom.descDewpoint.textContent = "Atmospheric gas condensation temperature threshold.";
    
    dom.valClouds.textContent = `${data.current.cloud}%`;
    dom.descClouds.textContent = "Total sky hemisphere obscuration albedo scaling.";
    
    dom.valMoonphase.textContent = dayForecastZero.astro.moon_phase;
    dom.descMoonphase.textContent = `Lunar illumination parameter: ${dayForecastZero.astro.moon_illumination}%`;
    
    dom.valRainchance.textContent = `${dayForecastZero.day.daily_chance_of_rain}%`;
    dom.descRainchance.textContent = `Total macro-scale accumulation calculation: ${dayForecastZero.day.totalprecip_mm}mm`;
    
    dom.valGust.innerHTML = `${data.current.gust_kph} <small>km/h</small>`;
    dom.descGust.textContent = "Maximum velocity vector transient turbulence bounds.";
    
    // Core Modular Enhancements Engines Launches
    parseAirQualityPayload(data.current.air_quality);
    renderAdvancedAlmanacChronologyCurve(dayForecastZero.astro, data.location.localtime);
    renderHourlyStripForecastRow(dayForecastZero.hour);
    renderMacroForecastLayout(data.forecast.forecastday);
    generatePlatformAnalyticalGraphs(data.forecast.forecastday);
    updateGeospatialRadarCenterpoint(data.location.lat, data.location.lon, data.location.name);
    evaluateAtmosphericAlertArrays(data.alerts);
    synthesizeAiStrategicInsights(data);
    
    // Adapt Active CSS Particle Layout Background Core Styles
    synchronizeCssDynamicBackgrounds(data.current.condition.code, data.current.is_day);
}

// FEATURE 1: Native Geolocation Core Implementation Engine
function triggerGeolocationDiscovery() {
    if (!navigator.geolocation) {
        displayPlatformToastAlert("System hardware architecture profile lacks GPS processing unit support.", "warning");
        executeDataAcquisitionPipeline("London"); 
        return;
    }
    
    setDashboardLoadingUI(true);
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const localizedQueryCoordinates = `${pos.coords.latitude},${pos.coords.longitude}`;
            executeDataAcquisitionPipeline(localizedQueryCoordinates);
        },
        (err) => {
            let msg = "Localization query initialization failure.";
            if (err.code === err.PERMISSION_DENIED) msg = "Location request authorization revoked by client browser infrastructure.";
            displayPlatformToastAlert(msg + " Reverting to fallback geographic baseline core metrics.", "warning");
            executeDataAcquisitionPipeline("New York");
        },
        { enableHighAccuracy: true, timeout: 8000 }
    );
}

// FEATURE 2: Detailed 24-Hour Micro Chronological Strip Array Rendering
function renderHourlyStripForecastRow(hoursArray) {
    dom.hourlyContainer.innerHTML = '';
    hoursArray.forEach(hr => {
        const timeValueString = hr.time.split(' ')[1]; 
        const node = document.createElement('div');
        node.className = 'hourly-node-card';
        node.innerHTML = `
            <span class="hourly-time">${timeValueString}</span>
            <div class="hourly-icon-box">
                <img src="https:${hr.condition.icon}" alt="${hr.condition.text}" loading="lazy">
            </div>
            <span class="hourly-temp">${Math.round(hr.temp_c)}°C</span>
            <span class="hourly-condition">${hr.condition.text}</span>
        `;
        dom.hourlyContainer.appendChild(node);
    });
}

// FEATURE 3: High-Fidelity Multi-Component Air Quality Assessment Analytics
function parseAirQualityPayload(aqi) {
    if (!aqi) return;
    
    const epaIndex = aqi['us-epa-index'] || 1;
    let classification = "Good";
    let degreeRotationValue = -90; 
    let colorHexValue = varCssExtractorValue('--success') || '#22C55E';
    
    switch (epaIndex) {
        case 1: classification = "Good Quality"; degreeRotationValue = -90; colorHexValue = varCssExtractorValue('--success') || '#22C55E'; break;
        case 2: classification = "Moderate"; degreeRotationValue = -54; colorHexValue = varCssExtractorValue('--warning') || '#F59E0B'; break;
        case 3: classification = "Unhealthy (Sensitive)"; degreeRotationValue = -18; colorHexValue = "#F97316"; break;
        case 4: classification = "Unhealthy Profile"; degreeRotationValue = 18; colorHexValue = varCssExtractorValue('--danger') || '#EF4444'; break;
        case 5: classification = "Very Unhealthy"; degreeRotationValue = 54; colorHexValue = "#A855F7"; break;
        case 6: classification = "Hazardous Biosphere"; degreeRotationValue = 90; colorHexValue = "#7F1D1D"; break;
    }
    
    dom.aqiGaugeNeedle.style.transform = `translateX(-50%) rotate(${degreeRotationValue}deg)`;
    dom.aqiGaugeVal.textContent = epaIndex;
    dom.aqiGaugeStatus.textContent = classification;
    dom.aqiGaugeStatus.style.color = colorHexValue;
    
    dom.valPm25.textContent = `${Math.round(aqi.pm2_5)} µg/m³`;
    dom.valPM10.textContent = `${Math.round(aqi.pm10)} µg/m³`; 
    dom.valCo.textContent = `${Math.round(aqi.co)} µg/m³`;
    dom.valNo2.textContent = `${Math.round(aqi.no2)} µg/m³`;
    dom.valO3.textContent = `${Math.round(aqi.o3)} µg/m³`;
    dom.valSo2.textContent = `${Math.round(aqi.so2)} µg/m³`;
}

// FEATURE 5: High-Performance Integrated Graphical Convergence Matrices (Chart.js Layer)
function generatePlatformAnalyticalGraphs(forecastDaysArray) {
    const labels = forecastDaysArray.map(d => {
        return new Date(d.date.replace(/-/g, "/")).toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    const datasetTempMax = forecastDaysArray.map(d => d.day.maxtemp_c);
    const datasetTempMin = forecastDaysArray.map(d => d.day.mintemp_c);
    const datasetHumidity = forecastDaysArray.map(d => d.day.avghumidity);
    const datasetWind = forecastDaysArray.map(d => d.day.maxwind_kph);
    const datasetRainChance = forecastDaysArray.map(d => d.day.daily_chance_of_rain);
    
    buildSpecificChartInstance('chart-temp-analytics', 'line', labels, [
        { label: 'Max Temperature (°C)', data: datasetTempMax, borderColor: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, tension: 0.4 },
        { label: 'Min Temperature (°C)', data: datasetTempMin, borderColor: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.1)', fill: true, tension: 0.4 }
    ]);
    
    buildSpecificChartInstance('chart-humidity-analytics', 'bar', labels, [
        { label: 'Mean Humidity (%)', data: datasetHumidity, backgroundColor: 'rgba(129, 140, 248, 0.6)', borderRadius: 8 }
    ]);
    
    buildSpecificChartInstance('chart-wind-analytics', 'line', labels, [
        { label: 'Max Wind Velocity (km/h)', data: datasetWind, borderColor: '#06B6D4', borderWidth: 3, tension: 0.3 }
    ]);
    
    buildSpecificChartInstance('chart-rain-analytics', 'bar', labels, [
        { label: 'Precipitation Probability (%)', data: datasetRainChance, backgroundColor: 'rgba(14, 165, 233, 0.5)', borderRadius: 8 }
    ]);
}

function buildSpecificChartInstance(canvasId, type, labels, datasets) {
    if (platformState.activeCharts[canvasId]) {
        platformState.activeCharts[canvasId].destroy();
    }
    
    const contextNode = document.getElementById(canvasId).getContext('2d');
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColorValue = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)';
    const textColorValue = isDark ? '#94A3B8' : '#64748B';

    platformState.activeCharts[canvasId] = new Chart(contextNode, {
        type: type,
        data: { labels: labels, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColorValue, font: { family: 'Inter', weight: 500 } } }
            },
            scales: {
                x: { grid: { color: gridColorValue }, ticks: { color: textColorValue } },
                y: { grid: { color: gridColorValue }, ticks: { color: textColorValue } }
            }
        }
    });
}

// FEATURE 6: Geospatial Radar Atmospheric Map Module Core Infrastructure
function updateGeospatialRadarCenterpoint(lat, lon, cityName) {
    const frame = document.getElementById('radar-map-canvas-frame');
    
    if (!platformState.radarMapInstance) {
        platformState.radarMapInstance = L.map(frame, { zoomControl: true }).setView([lat, lon], 11);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }).addTo(platformState.radarMapInstance);
    } else {
        platformState.radarMapInstance.setView([lat, lon], 11);
    }
    
    if (platformState.radarMarkerInstance) {
        platformState.radarMarkerInstance.remove();
    }
    
    platformState.radarMarkerInstance = L.marker([lat, lon]).addTo(platformState.radarMapInstance)
        .bindPopup(`<strong style="font-family: 'Poppins';">${cityName}</strong><br>Telemetry Transceiver Coordinate Lock.`)
        .openPopup();
        
    setTimeout(() => platformState.radarMapInstance.invalidateSize(), 400);
}

// FEATURE 7: Algorithmic Input Field Suggestion Core (Search Autocomplete)
async function handleSearchAutocompleteInput() {
    const rawValue = dom.searchInput.value.trim();
    if (rawValue.length < 3) {
        dom.suggestionsBox.classList.add('hidden');
        return;
    }
    
    try {
        const autocompleteUrl = `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(rawValue)}`;
        const res = await fetch(autocompleteUrl);
        if (!res.ok) return;
        const choices = await res.json();
        
        if (choices.length === 0) {
            dom.suggestionsBox.classList.add('hidden');
            return;
        }
        
        dom.suggestionsBox.innerHTML = '';
        dom.suggestionsBox.classList.remove('hidden');
        
        choices.forEach((choice, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.setAttribute('role', 'option');
            item.setAttribute('id', `suggest-node-${index}`);
            item.innerHTML = `
                <span>${choice.name}, <small>${choice.region}</small></span>
                <span class="country-code">${choice.country}</span>
            `;
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                dom.searchInput.value = `${choice.name}, ${choice.country}`;
                dom.suggestionsBox.classList.add('hidden');
                executeDataAcquisitionPipeline(dom.searchInput.value);
            });
            dom.suggestionsBox.appendChild(item);
        });
    } catch (e) {
        // Safe exception catch loops
    }
}

function handleSearchKeyboardNavigation(e) {
    const suggestions = dom.suggestionsBox.querySelectorAll('.suggestion-item');
    if (dom.suggestionsBox.classList.contains('hidden') || suggestions.length === 0) return;
    
    let currentFocusedIndex = Array.from(suggestions).findIndex(el => el.classList.contains('focused'));
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentFocusedIndex >= 0) suggestions[currentFocusedIndex].classList.remove('focused');
        currentFocusedIndex = (currentFocusedIndex + 1) % suggestions.length;
        suggestions[currentFocusedIndex].classList.add('focused');
        suggestions[currentFocusedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentFocusedIndex >= 0) suggestions[currentFocusedIndex].classList.remove('focused');
        currentFocusedIndex = (currentFocusedIndex - 1 + suggestions.length) % suggestions.length;
        suggestions[currentFocusedIndex].classList.add('focused');
        suggestions[currentFocusedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && currentFocusedIndex >= 0) {
        e.preventDefault();
        suggestions[currentFocusedIndex].click();
    }
}

// FEATURE 8: Critical Atmospheric Extreme Weather Warning Vector Analysis Engine
function evaluateAtmosphericAlertArrays(alertsObj) {
    dom.globalAlertCenter.innerHTML = '';
    
    if (!alertsObj || !alertsObj.alert || alertsObj.alert.length === 0) {
        dom.globalAlertCenter.classList.add('hidden');
        verifySyntheticThresholdAlerts();
        return;
    }
    
    dom.globalAlertCenter.classList.remove('hidden');
    alertsObj.alert.forEach(alertInstance => {
        const card = document.createElement('div');
        card.className = 'weather-alert-card';
        card.innerHTML = `
            <div class="alert-content-inner">
                <i class="fa-solid fa-cloud-bolt"></i>
                <div class="alert-msg-txt">
                    <h4>${alertInstance.event}</h4>
                    <p>${alertInstance.headline || "Precipitation/Thermal severity profile thresholds crossed."}</p>
                </div>
            </div>
            <button class="close-alert-btn" style="background:transparent;border:none;color:white;cursor:pointer;" onclick="this.parentElement.remove()">&times;</button>
        `;
        dom.globalAlertCenter.appendChild(card);
    });
}

function verifySyntheticThresholdAlerts() {
    const data = platformState.cachedWeatherData;
    if (!data) return;
    
    let syntheticAlerts = [];
    if (data.current.temp_c >= 38) {
        syntheticAlerts.push({ title: "Extreme Thermal Radiation Alert", msg: "Localized thermodynamic data readings indicate hazardous extreme heat wave index constraints." });
    }
    if (data.current.wind_kph >= 50) {
        syntheticAlerts.push({ title: "Severe Velocity Kinetic Turbulence Wind Gust", msg: "Turbulent structural hazard wind speeds tracked via localized barometric variance data arrays." });
    }
    
    if (syntheticAlerts.length > 0) {
        dom.globalAlertCenter.classList.remove('hidden');
        syntheticAlerts.forEach(alert => {
            const card = document.createElement('div');
            card.className = 'weather-alert-card';
            card.innerHTML = `
                <div class="alert-content-inner">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <div class="alert-msg-txt">
                        <h4>${alert.title}</h4>
                        <p>${alert.msg}</p>
                    </div>
                </div>
                <button class="close-alert-btn" style="background:transparent;border:none;color:white;cursor:pointer;" onclick="this.parentElement.remove()">&times;</button>
            `;
            dom.globalAlertCenter.appendChild(card);
        });
    }
}

// FEATURE 9: Unified Platform Strategic Information Web Share API Pipeline
async function executeWebShareApiPipeline() {
    const data = platformState.cachedWeatherData;
    if (!data) return;
    
    const contextPayload = {
        title: `SkyCast Framework Vector Analysis: ${data.location.name}`,
        text: `Localized Core Telemetry Analysis: ${data.location.name} is experiencing ${data.current.condition.text} at ${Math.round(data.current.temp_c)}°C. High Fidelity Strategic Data Layer.`,
        url: window.location.href
    };
    
    if (navigator.share) {
        try {
            await navigator.share(contextPayload);
            displayPlatformToastAlert("Data packet processed and transmitted successfully.", "success");
        } catch (e) {
            // Bypass logic configurations
        }
    } else {
        navigator.clipboard.writeText(`${contextPayload.text} Node details linked: ${contextPayload.url}`);
        displayPlatformToastAlert("Web Share API unsupported on interface. Telemetry manifest string copied to platform system clipboard.", "success");
    }
}

// FEATURE 10: High-Fidelity Client-Generated Structured PDF Analysis Reports (html2pdf Engine)
function generateHighFidelityPdfReport() {
    const targetElementNode = document.getElementById('exportable-weather-core');
    const data = platformState.cachedWeatherData;
    if (!data) return;
    
    displayPlatformToastAlert("Compiling structured report structures...", "success");
    const layoutSettingsProfile = {
        margin: 10,
        filename: `SkyCast_Report_${data.location.name}_2026.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0B1120' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(layoutSettingsProfile).from(targetElementNode).save();
}

// FEATURE 11: Real-time Ephemeris Solar Chronology Curve Positioning Tracking
function renderAdvancedAlmanacChronologyCurve(astroObj, localTimeStr) {
    try {
        const formatStringTimeToMinutes = (timeStr) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };
        
        const sunriseMinutes = formatStringTimeToMinutes(astroObj.sunrise);
        const sunsetMinutes = formatStringTimeToMinutes(astroObj.sunset);
        
        const extractionTimePart = localTimeStr.split(' ')[1];
        let [currentHours, currentMinutes] = extractionTimePart.split(':').map(Number);
        const currentMinutesTotal = currentHours * 60 + currentMinutes;
        
        let visualScalePercentage = 0;
        if (currentMinutesTotal <= sunriseMinutes) {
            visualScalePercentage = 0;
        } else if (currentMinutesTotal >= sunsetMinutes) {
            visualScalePercentage = 100;
        } else {
            const rangeSpan = sunsetMinutes - sunriseMinutes;
            const currentPositionOffset = currentMinutesTotal - sunriseMinutes;
            visualScalePercentage = (currentPositionOffset / rangeSpan) * 100;
        }
        
        dom.solarLiveNode.style.left = `${visualScalePercentage}%`;
        const normalizedY = Math.sin((visualScalePercentage / 100) * Math.PI) * 100;
        dom.solarLiveNode.style.transform = `translateX(-50%) translateY(${-normalizedY * 0.4}px)`;
        
        dom.valSunrise.textContent = astroObj.sunrise;
        dom.valSunset.textContent = astroObj.sunset;
    } catch (e) {
        // Exception validation bypass
    }
}

// FEATURE 13 & 14: Cross-City Telemetry Matrix Comparison Framework Logic
async function initializeComparisonMatrixDialog() {
    const baseData = platformState.cachedWeatherData;
    if (!baseData) return;
    
    const inputPromptNode = prompt("Enter alternative city matrix signature token for side-by-side comparison analytics:");
    if (!inputPromptNode) return;
    
    try {
        const compareUrl = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(inputPromptNode)}&days=1&aqi=yes`;
        const res = await fetch(compareUrl);
        if (!res.ok) throw new Error("Target matrix node failed validation.");
        const compareData = await res.json();
        
        dom.comparisonSection.classList.remove('hidden');
        dom.comparisonGridTarget.innerHTML = `
            <div class="compare-column-block">
                <h4>${baseData.location.name}</h4>
                <div class="compare-metrics-list">
                    <div class="compare-row-metric"><span class="lbl">Thermal Level</span><span class="val">${Math.round(baseData.current.temp_c)}°C</span></div>
                    <div class="compare-row-metric"><span class="lbl">Condensation Humidity</span><span class="val">${baseData.current.humidity}%</span></div>
                    <div class="compare-row-metric"><span class="lbl">Wind Velocity</span><span class="val">${baseData.current.wind_kph} km/h</span></div>
                    <div class="compare-row-metric"><span class="lbl">Air Quality Index</span><span class="val">${baseData.current.air_quality['us-epa-index'] || 'N/A'}</span></div>
                </div>
            </div>
            <div class="compare-column-block">
                <h4>${compareData.location.name}</h4>
                <div class="compare-metrics-list">
                    <div class="compare-row-metric"><span class="lbl">Thermal Level</span><span class="val">${Math.round(compareData.current.temp_c)}°C</span></div>
                    <div class="compare-row-metric"><span class="lbl">Condensation Humidity</span><span class="val">${compareData.current.humidity}%</span></div>
                    <div class="compare-row-metric"><span class="lbl">Wind Velocity</span><span class="val">${compareData.current.wind_kph} km/h</span></div>
                    <div class="compare-row-metric"><span class="lbl">Air Quality Index</span><span class="val">${compareData.current.air_quality['us-epa-index'] || 'N/A'}</span></div>
                </div>
            </div>
        `;
        dom.comparisonSection.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        displayPlatformToastAlert(err.message, "danger");
    }
}

// FEATURE 15: Natural Linguistic Speech Recognition Interface Processing (Voice Search)
function initializeVoiceRecognitionEngine() {
    const SpeechEngineClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechEngineClass) return;
    
    platformState.speechRecognitionEngine = new SpeechEngineClass();
    platformState.speechRecognitionEngine.continuous = false;
    platformState.speechRecognitionEngine.lang = 'en-US';
    platformState.speechRecognitionEngine.interimResults = false;
    
    platformState.speechRecognitionEngine.onstart = () => dom.voiceSearchBtn.classList.add('active');
    platformState.speechRecognitionEngine.onerror = () => dom.voiceSearchBtn.classList.remove('active');
    platformState.speechRecognitionEngine.onend = () => dom.voiceSearchBtn.classList.remove('active');
    
    platformState.speechRecognitionEngine.onresult = (e) => {
        const transcriptString = e.results[0][0].transcript;
        dom.searchInput.value = transcriptString;
        executeDataAcquisitionPipeline(transcriptString);
    };
}

// Activation toggle loops
function toggleVoiceCapturePipeline() {
    if (!platformState.speechRecognitionEngine) {
        displayPlatformToastAlert("Client client engine configuration lacks native Speech API layers.", "warning");
        return;
    }
    if (dom.voiceSearchBtn.classList.contains('active')) {
        platformState.speechRecognitionEngine.stop();
    } else {
        platformState.speechRecognitionEngine.start();
    }
}

// FEATURE 18: Live Synchronized Dynamic Clock Layer
function launchLiveClockEngine(localTimeString, timezoneString) {
    if (platformState.clockIntervalToken) clearInterval(platformState.clockIntervalToken);
    
    let nodeTime = new Date(localTimeString.replace(/-/g, "/"));
    
    platformState.clockIntervalToken = setInterval(() => {
        nodeTime.setSeconds(nodeTime.getSeconds() + 1);
        dom.currentTime.textContent = nodeTime.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
    }, 1000);
}

// FEATURE 19: Algorithmic Matrix Diagnosis Inference Output (Weather Insights System)
function synthesizeAiStrategicInsights(data) {
    let analyticalInsights = [];
    
    if (data.current.uv >= 6) analyticalInsights.push("Strategic Warning: Ultraviolet saturation index values are elevated. Enforce protective sunblock profiles.");
    if (data.current.humidity > 75 && data.current.condition.text.toLowerCase().includes('rain')) analyticalInsights.push("High atmospheric humidity vectors indicate active downpours. Maintain deployment of moisture-barrier protective canopies.");
    if (data.current.vis_km >= 10) analyticalInsights.push("Visual spectrum transparency meets maximum index. Ideal visibility range verified.");
    if (data.current.air_quality && data.current.air_quality['us-epa-index'] >= 3) analyticalInsights.push("Cautionary Alert: Particulate matter concentrations are degraded. Sensitive pulmonary health protocols are advised.");
    
    if (analyticalInsights.length === 0) {
        analyticalInsights.push("Microclimate equilibrium constants stable. No critical atmospheric optimization anomalies flagged.");
    }
    
    dom.aiInsightsContent.innerHTML = `
        <ul style="list-style:none; display:flex; flex-direction:column; gap:0.5rem; padding:0;">
            ${analyticalInsights.map(ins => `<li style="display:flex; gap:0.5rem; align-items:flex-start;"><i class="fa-solid fa-chevron-right text-accent" style="margin-top:0.25rem; font-size:0.8rem;"></i> <span>${ins}</span></li>`).join('')}
        </ul>
    `;
}

// FEATURE 20: Advanced Fluid Structural CSS Dynamic Background Engine Particle Handlers
function synchronizeCssDynamicBackgrounds(conditionCode, isDay) {
    document.body.className = '';
    if (!isDay) {
        document.body.classList.add('weather-night');
        return;
    }
    
    if (conditionCode === 1000) {
        document.body.classList.add('weather-sunny');
    } else if ([1003, 1006, 1009].includes(conditionCode)) {
        document.body.classList.add('weather-cloudy');
    } else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243].includes(conditionCode)) {
        document.body.classList.add('weather-rain');
    } else if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225].includes(conditionCode)) {
        document.body.classList.add('weather-snow');
    } else {
        document.body.classList.add('weather-cloudy');
    }
}

// Global Secondary Platform Modules (UI State Synchronizers & Handlers)
function renderMacroForecastLayout(days) {
    dom.forecastContainer.innerHTML = '';
    days.forEach(day => {
        const dayName = new Date(day.date.replace(/-/g, "/")).toLocaleDateString('en-US', { weekday: 'short' });
        const card = document.createElement('div');
        card.className = 'card forecast-card';
        card.innerHTML = `
            <div class="card-glow"></div>
            <span class="forecast-day">${dayName}</span>
            <div class="icon-box"><img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" loading="lazy"></div>
            <span class="forecast-temp">${Math.round(day.day.avgtemp_c)}°C</span>
            <span class="forecast-cond">${day.day.condition.text}</span>
        `;
        dom.forecastContainer.appendChild(card);
    });
}

function pushCityToRecentsArray(city) {
    platformState.recents = platformState.recents.filter(c => c.toLowerCase() !== city.toLowerCase());
    platformState.recents.unshift(city);
    if (platformState.recents.length > 5) platformState.recents.pop();
    localStorage.setItem('skycast_recents', JSON.stringify(platformState.recents));
    syncStorageUiComponents();
}

function toggleCurrentCityBookmarkStatus() {
    const data = platformState.cachedWeatherData;
    if (!data) return;
    
    const city = data.location.name;
    if (platformState.favorites.includes(city)) {
        platformState.favorites = platformState.favorites.filter(c => c !== city);
        displayPlatformToastAlert(`${city} removed from persistence database indexes.`, "warning");
    } else {
        platformState.favorites.push(city);
        displayPlatformToastAlert(`${city} added to tracking array vectors.`, "success");
    }
    localStorage.setItem('skycast_favorites', JSON.stringify(platformState.favorites));
    syncStorageUiComponents();
    updateBookmarkActionControlStatus();
}

function updateBookmarkActionControlStatus() {
    const data = platformState.cachedWeatherData;
    if (!data) return;
    
    const activeIcon = dom.addFavoriteToggleBtn.querySelector('i');
    const textLabel = dom.addFavoriteToggleBtn.querySelector('span');
    
    if (platformState.favorites.includes(data.location.name)) {
        dom.addFavoriteToggleBtn.classList.add('active');
        activeIcon.className = 'fa-solid fa-star';
        textLabel.textContent = 'Node Saved';
    } else {
        dom.addFavoriteToggleBtn.classList.remove('active');
        activeIcon.className = 'fa-regular fa-star';
        textLabel.textContent = 'Bookmark Node';
    }
}

function syncStorageUiComponents() {
    if (platformState.recents.length === 0) {
        dom.searchHistoryContainer.classList.add('hidden');
    } else {
        dom.searchHistoryContainer.classList.remove('hidden');
        dom.historyChips.innerHTML = '';
        platformState.recents.forEach(c => {
            const el = document.createElement('span');
            el.className = 'chip';
            el.textContent = c;
            el.addEventListener('click', () => { dom.searchInput.value = c; executeDataAcquisitionPipeline(c); });
            dom.historyChips.appendChild(el);
        });
    }

    if (platformState.favorites.length === 0) {
        dom.favoritesBar.classList.add('hidden');
    } else {
        dom.favoritesBar.classList.remove('hidden');
        dom.favoritesChips.innerHTML = '';
        platformState.favorites.forEach(c => {
            const el = document.createElement('span');
            el.className = 'chip text-primary';
            el.innerHTML = `<i class="fa-solid fa-star" style="font-size:0.75rem;"></i> ${c}`;
            el.addEventListener('click', () => { dom.searchInput.value = c; executeDataAcquisitionPipeline(c); });
            dom.favoritesChips.appendChild(el);
        });
    }
}

function applyConfiguredTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('skycast_theme', themeName);
    platformState.theme = themeName;
}

function setDashboardLoadingUI(isLoading) {
    if (isLoading) {
        dom.loadingState.classList.remove('hidden');
        dom.dashboardGrid.classList.add('hidden');
        dom.forecastContainer.parentElement.classList.add('hidden');
    } else {
        dom.loadingState.classList.add('hidden');
        dom.dashboardGrid.classList.remove('hidden');
        dom.forecastContainer.parentElement.classList.remove('hidden');
    }
}

function displayTelemetryExceptionCard(msg) {
    dom.dashboardSection.classList.remove('hidden');
    dom.errorCard.classList.remove('hidden');
    dom.errorMessage.textContent = msg;
    dom.dashboardGrid.classList.add('hidden');
    dom.forecastContainer.parentElement.classList.add('hidden');
}

function displayPlatformToastAlert(text, mode) {
    const notification = document.createElement('div');
    notification.className = 'weather-alert-card';
    notification.style.background = mode === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)';
    notification.style.borderColor = mode === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)';
    notification.innerHTML = `
        <div class="alert-content-inner">
            <i class="fa-solid ${mode === 'success' ? 'fa-circle-check text-success' : 'fa-circle-exclamation text-warning'}"></i>
            <div class="alert-msg-txt"><h4>System Broadcast</h4><p>${text}</p></div>
        </div>
    `;
    document.body.appendChild(notification);
    notification.style.position = 'fixed';
    notification.style.bottom = '2rem';
    notification.style.left = '2rem';
    notification.style.zIndex = '10000';
    setTimeout(() => notification.remove(), 4000);
}

function clearPlatformAlertCenter() {
    dom.globalAlertCenter.innerHTML = '';
    dom.globalAlertCenter.classList.add('hidden');
}

function parseWindowScrollStateY() {
    if (window.scrollY > 400) {
        dom.backToTopBtn.classList.add('visible');
    } else {
        dom.backToTopBtn.classList.remove('visible');
    }
}

function varCssExtractorValue(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function debounceRuntimeExecution(fn, wait) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

function registerPlatformServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(() => {
                // Secondary logging streams
            });
        });
    }
    
    let deferredInstallationPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallationPrompt = e;
        dom.pwaInstallBtn.classList.remove('hidden');
    });
    
    dom.pwaInstallBtn.addEventListener('click', () => {
        if (!deferredInstallationPrompt) return;
        deferredInstallationPrompt.prompt();
        deferredInstallationPrompt.userChoice.then(() => {
            deferredInstallationPrompt = null;
            dom.pwaInstallBtn.classList.add('hidden');
        });
    });
}