<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Status Distribution Chart -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Repair Status Distribution</h3>
      <div class="h-64">
        <DoughnutChart 
          v-if="statusChartData"
          :data="statusChartData" 
          :options="chartOptions" 
        />
        <div v-else class="flex items-center justify-center h-full text-gray-500">
          Loading chart data...
        </div>
      </div>
    </div>
    
    <!-- Monthly Submissions Chart -->
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Monthly Submissions</h3>
      <div class="h-64">
        <LineChart 
          v-if="monthlyChartData"
          :data="monthlyChartData" 
          :options="lineChartOptions"
        />
        <div v-else class="flex items-center justify-center h-full text-gray-500">
          Loading chart data...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Doughnut as DoughnutChart, Line as LineChart } from 'vue-chartjs';

// Register necessary Chart.js components including Filler for the fill option
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

const props = defineProps({
  submissions: {
    type: Array,
    required: true,
    default: () => []  // Provide a default empty array
  }
});

// Chart styles and colors
const chartColors = {
  pending: '#FCD34D', // Yellow
  in_progress: '#60A5FA', // Blue
  completed: '#34D399', // Green
  cancelled: '#F87171' // Red
};

// Status chart data
const statusChartData = computed(() => {
  try {
    console.log('Computing status chart data with submissions:', props.submissions?.length);
    
    // Count submissions by status
    const statusCounts = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    };
    
    // Check if submissions exist and have data - ensure it's an array
    if (!Array.isArray(props.submissions) || props.submissions.length === 0) {
      console.log('No submissions found for chart, returning default data');
      // For Chart.js 4, we need to return a properly formatted data object
      return {
        labels: ['No Data'],
        datasets: [
          {
            backgroundColor: ['#CCCCCC'],
            data: [1],
            borderWidth: 2
          }
        ]
      };
    }
    
    // Only include completed submissions (not partial)
    const completedSubmissions = props.submissions.filter(s => s && !s.is_partial);
    
    completedSubmissions.forEach(submission => {
      if (submission && statusCounts[submission.status] !== undefined) {
        statusCounts[submission.status]++;
      }
    });
    
    // Filter out statuses with 0 count to avoid empty segments
    const labels = [];
    const backgroundColors = [];
    const counts = [];
    
    if (statusCounts.pending > 0) {
      labels.push('Pending');
      backgroundColors.push(chartColors.pending);
      counts.push(statusCounts.pending);
    }
    
    if (statusCounts.in_progress > 0) {
      labels.push('In Progress');
      backgroundColors.push(chartColors.in_progress);
      counts.push(statusCounts.in_progress);
    }
  
  if (statusCounts.completed > 0) {
    labels.push('Completed');
    backgroundColors.push(chartColors.completed);
    counts.push(statusCounts.completed);
  }
  
  if (statusCounts.cancelled > 0) {
    labels.push('Cancelled');
    backgroundColors.push(chartColors.cancelled);
    counts.push(statusCounts.cancelled);
  }
  
  // If all counts are 0, show a placeholder
  if (counts.length === 0) {
    return {
      labels: ['No Data'],
      datasets: [
        {
          backgroundColor: ['#CCCCCC'],
          data: [1],
          borderWidth: 2
        }
      ]
    };
  }
  
  // Log the chart data we're about to return
  const chartData = {
    labels: labels,
    datasets: [
      {
        backgroundColor: backgroundColors,
        data: counts,
        borderWidth: 2
      }
    ]
  };
  
  console.log('Status chart data being returned:', chartData);
  return chartData;
  } catch (error) {
    console.error('Error generating status chart data:', error);
    return {
      labels: ['Error'],
      datasets: [
        {
          backgroundColor: ['#FF6B6B'],
          data: [1],
          borderWidth: 2
        }
      ]
    };
  }
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
};

// Monthly submissions chart data
const monthlyChartData = computed(() => {
  try {
    // Ensure props.submissions is an array and handle empty array
    if (!Array.isArray(props.submissions) || props.submissions.length === 0) {
      // For Chart.js 4, we need to return a properly formatted data object
      const defaultData = {
        labels: ['No Data'],
        datasets: [{
          label: 'Submissions',
          backgroundColor: 'rgba(96, 165, 250, 0.2)',
          borderColor: '#60A5FA',
          data: [0],
          fill: true,
          tension: 0.4
        }]
      };
      return defaultData;
    }
    
    // Only include completed submissions (not partial)
    const completedSubmissions = props.submissions.filter(s => !s.is_partial);
    
    // Get last 6 months of data
    const monthsData = getLast6MonthsData(completedSubmissions);
    
    return {
      labels: monthsData.labels,
      datasets: [
        {
          label: 'Submissions',
          backgroundColor: 'rgba(96, 165, 250, 0.2)',
          borderColor: '#60A5FA',
          data: monthsData.data,
          fill: true,
          tension: 0.4
        }
      ]
    };
  } catch (error) {
    console.error('Error generating monthly chart data:', error);
    return {
      labels: ['Error'],
      datasets: [{
        label: 'Error',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#EF4444',
        data: [0],
        fill: true,
        tension: 0.4
      }]
    };
  }
});

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  }
};

// Helper function to get the last 6 months of data
function getLast6MonthsData(submissions) {
  try {
    const labels = [];
    const data = [];
    const counts = {};
    
    // Generate the last 6 month names and initialize counts
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      labels.push(monthYear);
      counts[monthYear] = 0;
    }
    
    // Ensure submissions is an array before processing
    const safeSubmissions = Array.isArray(submissions) ? submissions : [];
    
    // Count submissions by month, ensuring we handle missing created_at values
    if (safeSubmissions.length > 0) {
      safeSubmissions.forEach(submission => {
        if (submission && submission.created_at) {
          try {
            const date = new Date(submission.created_at);
            if (!isNaN(date.getTime())) {
              const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
              
              if (counts[monthYear] !== undefined) {
                counts[monthYear]++;
              }
            }
          } catch (error) {
            console.error('Error processing date:', error);
          }
        }
      });
    }
    
    // Extract the data in the right order
    labels.forEach(monthYear => {
      data.push(counts[monthYear]);
    });
    
    return { labels, data };
  } catch (error) {
    console.error('Error in getLast6MonthsData:', error);
    // Return default data in case of error
    const defaultLabels = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      defaultLabels.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
    }
    return { 
      labels: defaultLabels, 
      data: [0, 0, 0, 0, 0, 0] 
    };
  }
}
</script>
