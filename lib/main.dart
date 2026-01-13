import 'package:flutter/material.dart';
import 'package:home_widget/home_widget.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const DaysLeftApp());
}

class DaysLeftApp extends StatelessWidget {
  const DaysLeftApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Days Left',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF8B7355),
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF5F0E8),
        useMaterial3: true,
      ),
      home: const DaysLeftHomePage(),
    );
  }
}

class DaysLeftHomePage extends StatefulWidget {
  const DaysLeftHomePage({super.key});

  @override
  State<DaysLeftHomePage> createState() => _DaysLeftHomePageState();
}

class _DaysLeftHomePageState extends State<DaysLeftHomePage> {
  int _daysLeft = 0;
  int _daysPassed = 0;
  int _totalDays = 365;
  double _progress = 0.0;

  @override
  void initState() {
    super.initState();
    _calculateDays();
    _updateWidget();
  }

  void _calculateDays() {
    final now = DateTime.now();
    final endOfYear = DateTime(now.year, 12, 31);
    final startOfYear = DateTime(now.year, 1, 1);
    
    final totalDays = endOfYear.difference(startOfYear).inDays + 1;
    final daysPassed = now.difference(startOfYear).inDays + 1;
    final daysLeft = endOfYear.difference(now).inDays;

    setState(() {
      _daysLeft = daysLeft;
      _daysPassed = daysPassed;
      _totalDays = totalDays;
      _progress = daysPassed / totalDays;
    });
  }

  Future<void> _updateWidget() async {
    try {
      await HomeWidget.saveWidgetData<int>('days_left', _daysLeft);
      await HomeWidget.saveWidgetData<int>('days_passed', _daysPassed);
      await HomeWidget.saveWidgetData<int>('progress', (_progress * 100).round());
      await HomeWidget.saveWidgetData<String>('year', DateTime.now().year.toString());
      
      await HomeWidget.updateWidget(
        name: 'DaysLeftWidgetProvider',
        androidName: 'DaysLeftWidgetProvider',
      );
    } catch (e) {
      debugPrint('Error updating widget: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F0E8), // Warm cream background
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 20),
              
              // Header row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Week indicators
                  Row(
                    children: List.generate(7, (index) {
                      return Container(
                        width: 8,
                        height: 8,
                        margin: const EdgeInsets.only(right: 4),
                        decoration: BoxDecoration(
                          color: index < (_daysPassed % 7) 
                              ? const Color(0xFF2D2D2D) 
                              : const Color(0xFFD4C4B0),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      );
                    }),
                  ),
                  
                  // Title
                  Text(
                    'DAYS OF YOUR LIFE',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 1.5,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 24),
              
              // Year Grid
              Expanded(
                child: _buildYearGrid(),
              ),
              
              const SizedBox(height: 24),
              
              // Bottom section
              Row(
                children: [
                  // Progress circle
                  SizedBox(
                    width: 32,
                    height: 32,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        CircularProgressIndicator(
                          value: _progress,
                          strokeWidth: 2,
                          backgroundColor: const Color(0xFFD4C4B0),
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            Color(0xFF4A9B7F),
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(width: 16),
                  
                  // Days left text
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '$_daysLeft days left',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF2D2D2D),
                        ),
                      ),
                      Text(
                        '${(_progress * 100).toStringAsFixed(0)}% complete',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                  
                  const Spacer(),
                  
                  // Update button
                  IconButton(
                    onPressed: () async {
                      _calculateDays();
                      await _updateWidget();
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Text('Widget updated'),
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: const Color(0xFF4A9B7F),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        );
                      }
                    },
                    icon: const Icon(Icons.refresh_rounded),
                    color: const Color(0xFF8B7355),
                  ),
                ],
              ),
              
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildYearGrid() {
    // Calculate grid dimensions
    // 365 days / 7 days per row = ~52 rows
    const int daysPerRow = 20; // Adjusted for better fit
    final int rows = (_totalDays / daysPerRow).ceil();
    
    return LayoutBuilder(
      builder: (context, constraints) {
        final double availableWidth = constraints.maxWidth;
        final double availableHeight = constraints.maxHeight;
        
        // Calculate dot size based on available space
        final double dotSize = (availableWidth / daysPerRow) - 4;
        final double actualDotSize = dotSize.clamp(6.0, 14.0);
        
        return SingleChildScrollView(
          child: Wrap(
            spacing: 3,
            runSpacing: 3,
            children: List.generate(_totalDays, (index) {
              final bool isPassed = index < _daysPassed;
              final bool isToday = index == _daysPassed - 1;
              
              return Container(
                width: actualDotSize,
                height: actualDotSize,
                decoration: BoxDecoration(
                  color: isPassed 
                      ? const Color(0xFF2D2D2D) 
                      : const Color(0xFFD4C4B0),
                  borderRadius: BorderRadius.circular(actualDotSize / 4),
                  border: isToday 
                      ? Border.all(
                          color: const Color(0xFF4A9B7F),
                          width: 2,
                        )
                      : null,
                ),
              );
            }),
          ),
        );
      },
    );
  }
}
