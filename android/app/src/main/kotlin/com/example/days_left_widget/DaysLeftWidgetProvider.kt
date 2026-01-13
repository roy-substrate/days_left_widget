package com.example.days_left_widget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import java.util.Calendar

class DaysLeftWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        // Widget enabled
    }

    override fun onDisabled(context: Context) {
        // Widget disabled
    }

    companion object {
        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            try {
                // Calculate days left directly (no dependency on Flutter)
                val calendar = Calendar.getInstance()
                val currentYear = calendar.get(Calendar.YEAR)
                val startOfYear = Calendar.getInstance().apply {
                    set(currentYear, Calendar.JANUARY, 1, 0, 0, 0)
                    set(Calendar.MILLISECOND, 0)
                }
                
                val totalDays = if (isLeapYear(currentYear)) 366 else 365
                val dayOfYear = calendar.get(Calendar.DAY_OF_YEAR)
                val daysLeft = totalDays - dayOfYear
                val progress = (dayOfYear * 100) / totalDays

                // Construct the RemoteViews object
                val views = RemoteViews(context.packageName, R.layout.days_left_widget)
                views.setTextViewText(R.id.widget_days_left, daysLeft.toString())
                views.setTextViewText(R.id.widget_label, "days left")
                views.setTextViewText(R.id.widget_progress, "$progress% complete")

                // Update the widget
                appWidgetManager.updateAppWidget(appWidgetId, views)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        
        private fun isLeapYear(year: Int): Boolean {
            return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
        }
    }
}
