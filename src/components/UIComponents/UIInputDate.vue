<template>
    <div class="w-full mb-2">
        <div v-if="showLabel" class="px-1 text-gray-500" >
            <strong>{{ fieldName }}</strong>
        </div>
        <!-- calendar section -->
        <div>
            <div
                class="calendar-container" 
                :id="inputID + '_calendar_container'"
                :data-disable-future="input.disable_future" 
                :data-disable-past="input.disable_pass"
            >
                <input
                    :class="[
                        'font-semibold',
                        'w-full',
                        'rounded px-3 py-2 border-2',
                        borderColor,
                        focusBorderColor,
                        'focus:outline-none',
                        'text-sm',
                        'bg-white',
                        'calendar-input'
                    ]
                    "
                    type="text"
                    :name="input.name"
                    :id="inputID"
                    v-model="input_value"
                    :placeholder="placeholderText"
                    :required="input.required"
                    :autocomplete="input.autocomplete"
                    @input="validateInput()"
                    readonly
                />
                <div class="calendar" :id="inputID + '_calendar'"></div>
            </div>
            <div class="hidden">
                <button id="ChevronleftButton">
                    <ChevronLeftIcon class="size-6 text-blue-500 cursor-pointer" />
                </button>
                <button id="ChevronRightButton">
                    <ChevronRightIcon class="size-6 text-blue-500 cursor-pointer" />
                </button>
            </div>
        </div>
        <!-- end calendar section -->
        <div class="px-1 min-h-6">
            <span :class="[
                'text-xs',
                'italic',
                'leading-1',
                colorText
                ]"
            >{{ input_sign }} </span>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, reactive, onMounted } from 'vue';
    import { ChevronLeftIcon, ChevronRightIcon  } from '@heroicons/vue/24/solid'
    
    const input = defineProps(
        {
            'name' : {
                type: String,
                required: true,
                default: 'input'
            },
            'placeholder' : {
                type: String,
                default: 'Write something here ...'
            },   
            'id' : {
                type: String,
                default: ''
            },
            'value' : {
                type: String,
            },
            'disable_future' : {
                type: String,
                default: 'false'
            },
            'disable_pass' : {
                type: String,
                default: 'false'
            },
            'field' : {
                type: String,
                default:''
            },
            'required' : {
                type: String,
                default: "false",
            },
            'rule' : {
                type: String,
                default: "all",
            },
            'ruleText' : {
                type: String,
                default: "",
            },
            'minChar' : {
                type: Number,
                default: -1,
            },
            'maxChar' : {
                type: Number,
                default: -1,
            },
            'autocomplete' : {
                type: String,
                default: 'on',
            },
        }
    );

    //set all props handlely
    const input_value = defineModel()
    const inputID = ref((input.id == '')? input.name + '_id': input.id )
    const required = (input.required == "true") // assign true or false
    const rule = input.rule
    const minChar = input.minChar
    const maxChar = input.maxChar
    const showLabel = ref( input.field && String(input.field).trim() != '' )
    input_value.value = input.value
    
    const isError= reactive({
        'typeError': null,
        'message':'',
        'error': false
    })

    //computed message over the input
    const input_sign = computed(()=>{
        return isError.error? isError.message: input.ruleText ;
    })

    // define computed border class
    const borderColor = computed(()=>{
        return (isError.error)? 'border-red-300' : 'border-blue-300'
    });

    const focusBorderColor = computed(()=>{
        return (isError.error )? 'focus:border-red-500' : 'focus:border-blue-500'
    })
    // computed color text
    const colorText = computed(()=>{
        return (isError.error)? 'text-red-500' : 'text-gray-500'
    })

    //computed placeholder
    const placeholderText = computed(()=>{
        let placeholder = String(input.placeholder).trim()
        return (
            required 
            && placeholder != '' 
            && String(input.field).trim() == "") ? placeholder + " *" : placeholder
    })
    
    //computed field name
    const fieldName = computed(()=>{
        let field = String(input.field).trim()
        return (required && field != '' )? field + " *" : field
    })

    let debounceTime = null;
    // define rules
    const validateInput = ()=>{
        validateRules()
        debouncedProcessInput(3000)
    }

    const debouncedProcessInput = (seconds)=>{
        clearTimeout(debounceTime)
        debounceTime = setTimeout(()=>{
            takeInputValue();  
        },seconds);
    }

    const takeInputValue = ()=>{
        validateRulesAfterInput()
    }
    
    const validateRules = () => {
        let exclude_character = '';
        let input_to_check = String(input_value.value).trim()
        input_to_check  = (input_to_check == 'undefined')? '' : input_to_check
        isError.typeError = ''
        isError.error = false
        isError.message = ''
        if (required && input_to_check == '' ) {
            isError.typeError = 'empty'
            isError.error = true
            isError.message = 'This field is required'
        }else if (rule == 'alphanumeric') {
            //this sentence only alphanumerics plus "_" characters are accepted
            exclude_character = input_to_check.match(/[^A-Z-a-z-0-9ñÑ\_]/)
            exclude_character = exclude_character == null? '' : exclude_character
            input_value.value = String(input_to_check.replace(/[^A-Z-a-z-0-9ñÑ\_]/,''))
            if (exclude_character != null && exclude_character.length > 0){
                isError.typeError = 'alphanumeric'
                isError.error = true
                isError.message = exclude_character + ' is not allowed'
            }
        }else if (rule == 'numeric'){
            exclude_character = input_to_check.match(/[^0-9]/)
            exclude_character = exclude_character == null? '' : exclude_character
            input_value.value = String(input_to_check.replace(/[^0-9]/,''))
            if (exclude_character.length > 0){
                isError.typeError = 'numeric'
                isError.error = true
                isError.message = exclude_character + ' is not numeric; therefore, it is not allowed'
            }
        }
    }

    //validate maximum and minimum char 
    const validateRulesAfterInput = ()=> {
         // validate minimun characters
         if (minChar > 0 && input_value.value.length < minChar){
            isError.typeError = 'minimun_chars'
            isError.error = true
            isError.message = 'Please enter at least '+ minChar +' characters'
        }
        
        // validate maximum characters
        if (maxChar > 0 && input_value.value.length > maxChar){
            isError.typeError = 'maximun_chars'
            isError.error = true
            isError.message = 'Please enter no more than '+ maxChar +' characters'
        }

        //validate email format
        if (rule == 'email') {
            const input_to_check = String(input_value.value).trim()
            // Define our regular expression.
            const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
            if (!input_to_check.match(validEmail)){
                isError.typeError = 'email_format'
                isError.error = true
                isError.message = 'Please enter a valid email format'
            }
        }

    }

    /**
    * validate if an error exist and return a boolean
    */
    const  checkValidateError = ()=>{
        validateRules()
        validateRulesAfterInput()
        return isError.error
    }
    
    const valueInput = ()=>{
        return input_value.value?? '';
    }

    // reset input
    const reset = ()=>{
        input_value.value = "";
        return input_value.value;
    }

    onMounted(()=>{
        // Initialize calendar after component is mounted
        initializeCalendar()
    })

    // Calendar functionality
    const initializeCalendar = () => {
        const container = document.querySelector("#"+ inputID.value +"_calendar_container");
        const input_calendar = document.querySelector("#" + inputID.value);
        const calendar = document.querySelector("#"+ inputID.value +"_calendar");
        const disableFuture = container.dataset.disableFuture === "true";
        const disablePast = container.dataset.disablePast === "true";

        let selectedDate = null;
        let viewDate = new Date();
        let showYearPicker = false;

        const months = [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
        ];
        const daysOfWeek = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

        function renderCalendar() {
            calendar.innerHTML = "";

            const header = document.createElement("div");
            header.className = "calendar-header";

            const prevBtnTemplate = document.querySelector("#ChevronleftButton");
            //create a copy about chevron button
            const prevBtn = prevBtnTemplate.cloneNode(true);
            prevBtn.onclick = () => {
                viewDate.setMonth(viewDate.getMonth() - 1);
                renderCalendar();
            };
            
            const nextBtnTemplate = document.querySelector("#ChevronRightButton");
            const nextBtn = nextBtnTemplate.cloneNode(true);
            nextBtn.onclick = () => {
                viewDate.setMonth(viewDate.getMonth() + 1);
                renderCalendar();
            };

            const title = document.createElement("div");
            const monthSpan = document.createElement("span");
            monthSpan.textContent = months[viewDate.getMonth()];
            const yearSpan = document.createElement("span");
            yearSpan.textContent = viewDate.getFullYear();
            yearSpan.className = "px-1 bg-blue-300 text-white rounded cursor-pointer ";
            yearSpan.onclick = () => {
                showYearPicker = !showYearPicker;
                renderCalendar();
            };
            title.appendChild(monthSpan);
            title.appendChild(document.createTextNode(" "));
            title.appendChild(yearSpan);

            header.appendChild(prevBtn);
            header.appendChild(title);
            header.appendChild(nextBtn);

            calendar.appendChild(header);

            if (showYearPicker) {
                renderYearPicker();
                return;
            }

            const daysRow = document.createElement("div");
            daysRow.className = "days-of-week";
            daysOfWeek.forEach(d => {
                const div = document.createElement("div");
                div.textContent = d;
                daysRow.appendChild(div);
            });
            calendar.appendChild(daysRow);

            const daysGrid = document.createElement("div");
            daysGrid.className = "days-grid";

            const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
            const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                daysGrid.appendChild(document.createElement("div"));
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const dayDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
                const dayDiv = document.createElement("div");
                dayDiv.textContent = d;

                if (isDisabled(dayDate)) {
                    dayDiv.classList.add("disabled");
                } else {
                    dayDiv.onclick = () => {
                        selectedDate = dayDate;
                        input_value.value = selectedDate.toISOString().slice(0, 10);
                        calendar.style.display = "none";
                        renderCalendar();
                    };
                }

                if (selectedDate && dayDate.toDateString() === selectedDate.toDateString()) {
                    dayDiv.classList.add("selected");
                }

                daysGrid.appendChild(dayDiv);
            }

            calendar.appendChild(daysGrid);
        }

        function renderYearPicker() {
            const yearGrid = document.createElement("div");
            yearGrid.className = "year-grid";
            
            const start = Math.floor(viewDate.getFullYear() / 12) * 12;
            for (let y = start; y < start + 12; y++) {
                const div = document.createElement("div");
                div.textContent = y;
                div.onclick = () => {
                viewDate.setFullYear(y);
                showYearPicker = false;
                renderCalendar();
                };
                yearGrid.appendChild(div);
            }
            calendar.appendChild(yearGrid);
        }

        function isDisabled(date) {
            const today = new Date();
            today.setHours(0,0,0,0);
            
            if (disableFuture && date > today) return true;
            if (disablePast && date < today) return true;
            return false;
        }

        input_calendar.addEventListener("click", () => {
            calendar.style.display = calendar.style.display === "block" ? "none" : "block";
            renderCalendar();
        });

    };

    const attribute = {
        'name':input.name,
        'placeholder':input.placeholder,
        'id':input.id,
        'value':input.value,
        'field':input.field,
        'required':input.required,
        'rule':input.rule,
        'ruleText':input.ruleText,
        'minChar':input.minChar,
        'maxChar':input.maxChar,
        'autocomplete':input.autocomplete
    }
    // expose the checkValidateError to parent component
    defineExpose({checkValidateError,valueInput, attribute, reset})
    
</script>

<style scopes >
    .calendar-container {
      position: relative;
    }

    .calendar-input {
      cursor: pointer;
    }

    .calendar {
      position: absolute;
      top: 45px;
      width: 100%;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 100;
      display: none;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }

    .calendar-header button {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
    }

    .calendar-header span {
      font-weight: bold;
    }

    .days-of-week, .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      padding: 4px;
    }

    .days-of-week div {
      font-weight: bold;
      font-size: 12px;
    }

    .days-grid div {
      padding: 8px;
      cursor: pointer;
      border-radius: 4px;
    }

    .days-grid div:hover {
      background: #e6f0ff;
    }

    .selected {
      background: #007BFF;
      color: white !important;
    }

    .disabled {
      color: #bbb;
      cursor: not-allowed;
    }

    .year-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      padding: 10px;
    }

    .year-grid div {
      padding: 8px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
    }

    .year-grid div:hover {
      background: #e6f0ff;
    }
</style>