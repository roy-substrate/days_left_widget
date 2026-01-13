# Days Left Widget

A minimalist Flutter app that shows the number of days remaining in the year, with a beautiful home screen widget for Android.

![Design Language](https://img.shields.io/badge/Design-Minimalist-F5F0E8)
![Platform](https://img.shields.io/badge/Platform-Android-3DDC84)
![Flutter](https://img.shields.io/badge/Flutter-3.38-02569B)

## Features

- 📅 **Year Grid View** - Visualize all 365 days as a dot matrix
- 🎯 **Days Counter** - See exactly how many days are left in the year
- 📊 **Progress Tracking** - Track your year completion percentage
- 🏠 **Home Screen Widget** - Beautiful minimal widget for quick glance

## Screenshots

The app follows a minimalist design inspired by [@13doots](https://x.com/13doots):

- Warm cream background (`#F5F0E8`)
- Dark dots for days passed
- Light dots for remaining days
- Clean, distraction-free interface

## Design Philosophy

> "No gamification. No streak pressure. Just a simple reminder that every day counts, and your life is happening one day at a time."

## Installation

### From Source

1. Clone the repository:
```bash
git clone https://github.com/roy-substrate/days_left_widget.git
cd days_left_widget
```

2. Install dependencies:
```bash
flutter pub get
```

3. Build the APK:
```bash
flutter build apk --release
```

4. Install on your device:
```bash
adb install build/app/outputs/flutter-apk/app-release.apk
```

## Adding the Widget

1. Open the Days Left app once
2. Long press on your home screen
3. Tap "Widgets"
4. Find "Days Left" and drag to your home screen

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Background | Warm Cream | `#F5F0E8` |
| Days Passed | Dark Gray | `#2D2D2D` |
| Days Remaining | Light Tan | `#D4C4B0` |
| Progress Accent | Soft Green | `#4A9B7F` |
| Text | Muted Gray | `#6B6B6B` |

## Tech Stack

- **Framework**: Flutter 3.38
- **Language**: Dart, Kotlin
- **Widget Package**: home_widget
- **Platform**: Android

## License

MIT License - feel free to use and modify!

## Acknowledgments

Design inspiration from [@13doots](https://x.com/13doots/status/2009303700875972720)
