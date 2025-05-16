import { defineStore } from 'pinia';
import api from '../services/api';
import { useDeviceStore } from './deviceStore';

export const useRepairStore = defineStore('repair', {
  state: () => ({
    formData: {
      device_id: null,
      problems: [],
      battery_option: null,
      display_option: null,
      battery_add_on: false,
      bundle_battery_option: null,
      earpiece_option: null,
      speaker_option: null,
      charging_issue_type: null,
      dead_phone_issue_type: null,
      other_problem_description: '',
      service_history: null,
      previous_repair_by: null,
      previous_repair_details: '',
      previous_repair_other_details: '',
      full_name: '',
      whatsapp_number: '',
      is_from_lahore: null,
      needs_pickup_delivery: false,
      address: '',
      agreed_to_terms: false,
      calculated_price: 0,
    },
    isLoading: false,
    error: null,
    currentStep: 1,
    totalSteps: 5,
    submissionId: null,
    formattedSubmissionId: null, // Added to store the formatted ID
    submissions: [], // for admin view
    currentSubmission: null, // For viewing a single submission
    preserveFormState: false, // Flag to preserve form state when navigating to Terms
    lastPartialSubmissionTime: null, // Track when the last partial submission was saved

    // Pricing data will be fetched from API
    pricingData: {}
  }),
  
  actions: {
    // Fetch pricing data from API
    async fetchPricingData() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.repairs.getPricingData();
        this.pricingData = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to fetch pricing data';
        console.error('Error fetching pricing data:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    updateFormField(field, value) {
      this.formData[field] = value;
    },
    
    selectProblem(problem) {
      if (!this.formData.problems.includes(problem)) {
        this.formData.problems.push(problem);
      }
    },
    
    removeProblem(problem) {
      this.formData.problems = this.formData.problems.filter(p => p !== problem);
    },
    
    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        // Save partial submission data when a user advances to the next step
        this.savePartialSubmission();
      }
    },
    
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    
    // Save partial submission for analytics
    async savePartialSubmission() {
      // Only save if we've selected a device (step 1 completed)
      if (!this.formData.device_id) return;
      
      try {
        // Prepare data for partial submission
        const partialData = {
          ...this.formData,
          last_completed_step: this.currentStep - 1, // The step we just completed
          is_partial: true
        };
        
        // Skip frequent partial submissions if they happen too quickly
        const now = Date.now();
        if (this.lastPartialSubmissionTime && 
            (now - this.lastPartialSubmissionTime < 5000)) { // Don't save more often than every 5 seconds
          console.log('Skipping partial submission - too soon after previous submission');
          return;
        }
        
        // Update the timestamp
        this.lastPartialSubmissionTime = now;
        
        // Send to the partial submission endpoint
        await api.submissions.savePartial(partialData);
        console.log('Partial submission saved');
      } catch (error) {
        console.error('Error saving partial submission:', error);
        // Don't interrupt the user flow if this fails
      }
    },
    
    calculatePrice() {
      let price = 0;
      
      // Get the device model from the device store
      const deviceStore = useDeviceStore();
      const selectedDevice = deviceStore.getDeviceById(this.formData.device_id);
      
      if (!selectedDevice) {
        console.warn('No device selected, cannot calculate price');
        return 0;
      }
      
      const deviceModel = selectedDevice.model;
      const devicePricing = this.pricingData[deviceModel];
      
      if (!devicePricing) {
        console.warn(`No pricing data available for ${deviceModel}`);
        return 0;
      }
      
      // Calculate price based on selected problems and options
      this.formData.problems.forEach(problem => {
        switch (problem) {
          case 'battery':
            if (this.formData.battery_option && devicePricing.battery) {
              // Handle battery pricing
              const batteryPrice = devicePricing.battery[this.formData.battery_option];
              if (batteryPrice) {
                price += batteryPrice;
              }
            }
            break;
            
          case 'display':
            if (this.formData.display_option && devicePricing.display) {
              // Handle display pricing
              const displayPrice = devicePricing.display[this.formData.display_option];
              if (displayPrice) {
                price += displayPrice;
                
                // If battery_add_on and not already fixing battery separately
                if (this.formData.battery_add_on && 
                    !this.formData.problems.includes('battery') && 
                    devicePricing.battery) {
                  // Check if battery_option is explicitly selected for the bundled battery
                  const batteryOption = this.formData.bundle_battery_option || 'Aftermarket';
                  const batteryPrice = devicePricing.battery[batteryOption];
                  if (batteryPrice) {
                    // Add battery price with 10% discount when bundled with display
                    price += Math.floor(batteryPrice * 0.9);
                  }
                }
              }
            }
            break;
            
          case 'earpiece':
            if (this.formData.earpiece_option && devicePricing.earpiece) {
              // Handle earpiece pricing based on selected option
              const earpiecePrice = devicePricing.earpiece[this.formData.earpiece_option];
              if (earpiecePrice) {
                price += earpiecePrice;
              
                // If battery_add_on and not already fixing battery separately
                if (this.formData.battery_add_on && 
                    !this.formData.problems.includes('battery') && 
                    devicePricing.battery) {
                  // Check if battery_option is explicitly selected for the bundled battery
                  const batteryOption = this.formData.bundle_battery_option || 'Aftermarket';
                  const batteryPrice = devicePricing.battery[batteryOption];
                  if (batteryPrice) {
                    // Add battery price with 10% discount when bundled with earpiece
                    price += Math.floor(batteryPrice * 0.9);
                  }
                }
              }
            }
            break;
            
          case 'speaker':
            if (this.formData.speaker_option && devicePricing.speaker) {
              // Handle speaker pricing based on selected option
              const speakerPrice = devicePricing.speaker[this.formData.speaker_option];
              if (speakerPrice) {
                price += speakerPrice;
              
                // If battery_add_on and not already fixing battery separately
                if (this.formData.battery_add_on && 
                    !this.formData.problems.includes('battery') && 
                    devicePricing.battery) {
                  // Check if battery_option is explicitly selected for the bundled battery
                  const batteryOption = this.formData.bundle_battery_option || 'Aftermarket';
                  const batteryPrice = devicePricing.battery[batteryOption];
                  if (batteryPrice) {
                    // Add battery price with 10% discount when bundled with speaker
                    price += Math.floor(batteryPrice * 0.9);
                  }
                }
              }
            }
            break;
            
          case 'charging':
          case 'dead':
          case 'other':
            // These require diagnostics - add a base diagnostic fee if only these problems are selected
            // Only add diagnostic fee if no parts replacement is already included
            break;
        }
      });
      
      // Add delivery charge if pickup/delivery is requested
      if (this.formData.needs_pickup_delivery) {
        // Standard delivery charge for Lahore is Rs 500
        price += 500;
      }
      
      // Update the calculated price in the form data
      this.formData.calculated_price = price;
      return price;
    },
    
    async submitForm() {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Calculate final price before submitting
        this.calculatePrice();
        
        // Transform form data to match database schema before submission
        const submissionData = {
          name: this.formData.full_name,
          email: this.formData.whatsapp_number,
          phone: this.formData.whatsapp_number,
          device_id: this.formData.device_id,
          repair_ids: [],
          status: 'pending',
          problems: this.formData.problems,
          battery_option: this.formData.battery_option,
          display_option: this.formData.display_option,
          battery_add_on: this.formData.battery_add_on,
          earpiece_option: this.formData.earpiece_option,
          speaker_option: this.formData.speaker_option,
          charging_issue_type: this.formData.charging_issue_type,
          dead_phone_issue_type: this.formData.dead_phone_issue_type,
          other_problem_description: this.formData.other_problem_description,
          service_history: this.formData.service_history,
          previous_repair_by: this.formData.previous_repair_by,
          previous_repair_details: this.formData.previous_repair_details,
          previous_repair_other_details: this.formData.previous_repair_other_details,
          is_from_lahore: this.formData.is_from_lahore,
          needs_pickup_delivery: this.formData.needs_pickup_delivery,
          address: this.formData.address,
          agreed_to_terms: this.formData.agreed_to_terms,
          calculated_price: this.formData.calculated_price
        };
        
        console.log("Submitting data:", submissionData);
        
        const response = await api.submissions.create(submissionData);
        console.log("Full server response data:", response.data);
        
        this.submissionId = response.data.id;
        
        // Store the formatted ID from the response
        if (response.data.formatted_id) {
          this.formattedSubmissionId = response.data.formatted_id;
          console.log(`Submission created with formatted ID: ${this.formattedSubmissionId}`);
        } else {
          console.warn('No formatted ID received from server, using numeric ID instead');
          this.formattedSubmissionId = null;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to submit form';
        console.error('Error submitting form:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    resetForm() {
      // If we are preserving the form state (for Terms & Conditions navigation), just reset the flag
      if (this.preserveFormState) {
        this.preserveFormState = false;
        return;
      }
      
      // Otherwise reset the form completely
      this.formData = {
        device_id: null,
        problems: [],
        battery_option: null,
        display_option: null,
        battery_add_on: false,
        bundle_battery_option: null,
        earpiece_option: null,
        speaker_option: null,
        charging_issue_type: null,
        dead_phone_issue_type: null,
        other_problem_description: '',
        service_history: null,
        previous_repair_by: null,
        previous_repair_details: '',
        previous_repair_other_details: '',
        full_name: '',
        whatsapp_number: '',
        is_from_lahore: null,
        needs_pickup_delivery: false,
        address: '',
        agreed_to_terms: false,
        calculated_price: 0,
      };
      this.currentStep = 1;
      this.error = null;
    },
    
    // Admin actions
    async fetchSubmissions() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.submissions.getAll();
        
        // Make sure response.data is an array
        if (Array.isArray(response.data)) {
          this.submissions = response.data;
        } else {
          console.warn('Response data is not an array:', response.data);
          this.submissions = [];
        }
        
        return this.submissions;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Failed to fetch submissions';
        console.error('Error fetching submissions:', error);
        this.submissions = []; // Set to empty array on error
        return this.submissions; // Return empty array instead of throwing
      } finally {
        this.isLoading = false;
      }
    },
    
    // Get a single submission by ID - completely rewritten
    fetchSubmissionById(id) {
      console.log(`Fetching submission with ID: ${id}`);
      this.isLoading = true;
      this.error = null;
      
      return api.submissions.getById(id)
        .then(response => {
          console.log("Submission data received:", response.data);
          this.currentSubmission = response.data;
          return response.data;
        })
        .catch(error => {
          console.error("Error fetching submission:", error);
          this.error = error.message || 'Failed to fetch submission details';
          throw error;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    
    async updateSubmissionStatus(id, status, additionalData = {}) {
      this.isLoading = true;
      this.error = null;
      
      try {
        console.log(`Updating submission ${id} status to: ${status}`);
        console.log(`Additional data:`, additionalData);
        
        const response = await api.submissions.updateStatus(id, status, additionalData);
        console.log('Status update response:', response.data);
        
        // Verify that the status was actually updated in the response
        if (response.data.status !== status) {
          console.warn(`Server returned status ${response.data.status} instead of ${status}`);
        }
        
        // Update the status in the local state
        const index = this.submissions.findIndex(sub => sub.id === id);
        if (index !== -1) {
          // Update the status
          this.submissions[index].status = status;
          
          // Also update additional fields like completion_date, cancellation_date, cancellation_notes
          if (status === 'completed' && response.data.completion_date) {
            this.submissions[index].completion_date = response.data.completion_date;
          }
          
          if (status === 'cancelled') {
            if (response.data.cancellation_date) {
              this.submissions[index].cancellation_date = response.data.cancellation_date;
            }
            // Make sure cancellation notes are updated from both the additionalData and the response
            if (additionalData.cancellation_notes) {
              console.log(`Setting cancellation notes from additionalData: ${additionalData.cancellation_notes}`);
              this.submissions[index].cancellation_notes = additionalData.cancellation_notes;
            } else if (response.data.cancellation_notes) {
              console.log(`Setting cancellation notes from response: ${response.data.cancellation_notes}`);
              this.submissions[index].cancellation_notes = response.data.cancellation_notes;
            }
          }
          
          console.log(`Updated local submission at index ${index} to status: ${status}`);
        } else {
          console.warn(`Could not find submission ${id} in local state to update`);
        }
        
        // Also update currentSubmission if it matches the id
        if (this.currentSubmission && this.currentSubmission.id === id) {
          // Update the status
          this.currentSubmission.status = status;
          
          // Also update additional fields
          if (status === 'completed' && response.data.completion_date) {
            this.currentSubmission.completion_date = response.data.completion_date;
          }
          
          if (status === 'cancelled') {
            if (response.data.cancellation_date) {
              this.currentSubmission.cancellation_date = response.data.cancellation_date;
            }
            // Make sure cancellation notes are updated from both the additionalData and the response
            if (additionalData.cancellation_notes) {
              console.log(`Setting currentSubmission cancellation notes: ${additionalData.cancellation_notes}`);
              this.currentSubmission.cancellation_notes = additionalData.cancellation_notes;
            } else if (response.data.cancellation_notes) {
              console.log(`Setting currentSubmission cancellation notes from response: ${response.data.cancellation_notes}`);
              this.currentSubmission.cancellation_notes = response.data.cancellation_notes;
            }
          }
          
          console.log(`Updated currentSubmission to status: ${status}`);
        }
        
        return response.data;
      } catch (error) {
        console.error('Error updating submission status:', error.response || error);
        this.error = error.response?.data?.error || error.message || 'Failed to update submission status';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
  
  getters: {
    isDeviceSelected: (state) => !!state.formData.device_id,
    
    hasProblems: (state) => state.formData.problems.length > 0,
    
    showBatteryOptions: (state) => state.formData.problems.includes('battery'),
    
    showDisplayOptions: (state) => state.formData.problems.includes('display'),
    
    showEarpieceOptions: (state) => state.formData.problems.includes('earpiece'),
    
    showSpeakerOptions: (state) => state.formData.problems.includes('speaker'),
    
    showChargingOptions: (state) => state.formData.problems.includes('charging'),
    
    showDeadPhoneOptions: (state) => state.formData.problems.includes('dead'),
    
    showOtherProblemField: (state) => state.formData.problems.includes('other'),
    
    // Check if a device supports a specific repair type
    hasRepairOption: (state) => (device, repairType, option = null) => {
      if (!device || !state.pricingData[device.model]) return false;
      
      const pricing = state.pricingData[device.model];
      
      // Check for iPhone 14 series - no earpiece or speaker repairs
      if ((device.model.includes('iPhone 14') || device.model.includes('iPhone 14 Pro') || 
           device.model.includes('iPhone 14 Plus') || device.model.includes('iPhone 14 Pro Max')) && 
          (repairType === 'earpiece' || repairType === 'speaker')) {
        return false;
      }
      
      // For iPhone 14 series, no aftermarket display option
      if ((device.model.includes('iPhone 14') || device.model.includes('iPhone 14 Pro') || 
           device.model.includes('iPhone 14 Plus') || device.model.includes('iPhone 14 Pro Max')) && 
          repairType === 'display' && option === 'Aftermarket') {
        return false;
      }
      
      if (option) {
        return pricing[repairType] && pricing[repairType][option] !== undefined && pricing[repairType][option] !== null;
      }
      
      return pricing[repairType] !== undefined && pricing[repairType] !== null;
    },
    
    isFormComplete: (state) => {
      // Basic validation - can be expanded based on requirements
      return !!(
        state.formData.device_id &&
        state.formData.problems.length > 0 &&
        state.formData.full_name &&
        state.formData.whatsapp_number &&
        state.formData.agreed_to_terms
      );
    },

    // New getter for Step 3 validation
    isProblemDetailsValid: (state) => {
      // Check for each problem type if the required options are selected
      for (const problem of state.formData.problems) {
        switch (problem) {
          case 'battery':
            if (!state.formData.battery_option) return false;
            break;
          case 'display':
            if (!state.formData.display_option) return false;
            // If battery add-on is selected, a battery option must be selected
            if (state.formData.battery_add_on && !state.formData.bundle_battery_option) return false;
            break;
          case 'earpiece':
            if (!state.formData.earpiece_option) return false;
            // If battery add-on is selected, a battery option must be selected
            if (state.formData.battery_add_on && !state.formData.bundle_battery_option) return false;
            break;
          case 'speaker':
            if (!state.formData.speaker_option) return false;
            // If battery add-on is selected, a battery option must be selected
            if (state.formData.battery_add_on && !state.formData.bundle_battery_option) return false;
            break;
          case 'charging':
            if (!state.formData.charging_issue_type) return false;
            break;
          case 'dead':
            if (!state.formData.dead_phone_issue_type) return false;
            break;
          case 'other':
            if (!state.formData.other_problem_description || 
                state.formData.other_problem_description.trim() === '') return false;
            break;
        }
      }
      return true;
    },

    // New getter for Step 4 validation
    isServiceHistoryValid: (state) => {
      // First check if service history is selected
      if (state.formData.service_history === null) return false;
      
      // If 'yes' is selected, check if previous repair provider is selected
      if (state.formData.service_history === 'yes') {
        if (!state.formData.previous_repair_by) return false;
        
        // If 'other' is selected for repair provider, check if details are provided
        if (state.formData.previous_repair_by === 'other' && 
            (!state.formData.previous_repair_other_details || 
             state.formData.previous_repair_other_details.trim() === '')) {
          return false;
        }
        
        // For the previous_repair_details, we don't need to check anything as it's a comma-separated list
        // and it's okay if it's empty
      }
      
      return true;
    },
    
    // New getter for form validation on Step 5
    isFormValid: (state) => {
      return !!(
        state.formData.full_name &&
        state.formData.whatsapp_number &&
        state.formData.is_from_lahore !== null &&
        // If pickup & delivery is needed, address is required
        (state.formData.needs_pickup_delivery === false || 
         (state.formData.needs_pickup_delivery === true && state.formData.address && state.formData.address.trim() !== '')) &&
        state.formData.agreed_to_terms
      );
    }
  }
});