<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
    <h1 class="text-3xl font-bold text-center mb-8">Terms & Conditions</h1>
    
    <div class="prose max-w-none">
      <h2>1. Repair Services</h2>
      <p>REGEN Repairs offers professional iPhone repair services. By submitting a repair request, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.</p>
      
      <h2>2. Device Information</h2>
      <p>You are responsible for providing accurate information about your device and the problems you are experiencing. Inaccurate information may result in delays or additional charges.</p>
      
      <h2>3. Pricing</h2>
      <p>The prices provided on the website and through the repair form are estimates. Final prices may vary based on the actual condition of your device and the extent of repairs needed after physical inspection.</p>
      <p>Additional charges may apply if additional problems are discovered during the repair process. You will be notified of any additional charges before proceeding with the repair.</p>
      
      <h2>4. Pickup and Delivery</h2>
      <p>Pickup and delivery services are available for a fee of Rs. 500 within Lahore city limits only. Pickup and delivery times are estimates and may vary based on traffic conditions and technician availability.</p>
      
      <h2>5. Data and Backup</h2>
      <p>REGEN Repairs is not responsible for any data loss that may occur during the repair process. It is your responsibility to back up all data before submitting your device for repair.</p>
      <p>We recommend making a complete backup of your device before sending it for repair. REGEN Repairs does not perform data backup or recovery services.</p>
      
      <h2>6. Warranty</h2>
      <p>All repairs come with a limited warranty as specified:</p>
      <ul>
        <li>OEM parts: 1-year warranty against manufacturing defects</li>
        <li>Aftermarket parts: 6-month warranty against manufacturing defects</li>
      </ul>
      <p>The warranty does not cover:</p>
      <ul>
        <li>Physical damage after repair</li>
        <li>Water damage after repair</li>
        <li>Unauthorized modifications after repair</li>
        <li>Normal wear and tear</li>
      </ul>
      
      <h2>7. Unclaimed Devices</h2>
      <p>Repaired devices must be claimed within 30 days of notification that the repair is complete. REGEN Repairs is not responsible for devices left unclaimed for more than 30 days and may charge storage fees.</p>
      
      <h2>8. Privacy Policy</h2>
      <p>REGEN Repairs respects your privacy and will only use your personal information for communication regarding your repair service. We will not share your information with third parties except as required to complete your repair service.</p>
      
      <h2>9. Limitation of Liability</h2>
      <p>REGEN Repairs' liability is limited to the cost of the repair service. We are not responsible for any indirect, incidental, or consequential damages arising from the use of our services.</p>
      
      <h2>10. Changes to Terms</h2>
      <p>REGEN Repairs reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on our website.</p>
    </div>
    
    <div class="mt-8 text-center">
      <router-link to="/repair-form" class="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors">
        Back to Repair Form
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useRepairStore } from '../store/repairStore';

const router = useRouter();
const repairStore = useRepairStore();

// Prevent resetting the form when visiting terms
if (!repairStore.preserveFormState) {
  repairStore.preserveFormState = true;
}
</script>