(function () {
  // 1. Inject loader HTML and CSS instantly
  document.write(`
    <style>
       .loader-container {
           display: flex;
   align-items: center;
       justify-content: center;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    z-index: 9999999999;
    background: rgba(250, 250, 250, 0.9);
        }
      
        /* Animation for the loader */
        .B, .C, .D, .E, .F {
            animation: colorFill 2s infinite alternate;
        }
        
        .B { animation-delay: 0.1s; }
        .C { animation-delay: 0.2s; }
        .D { animation-delay: 0.3s; }
        .E { animation-delay: 0.4s; }
        .F { animation-delay: 0.5s; }
        
        @keyframes colorFill {
            0% {
                opacity: 0.3;
                filter: brightness(80%);
            }
            100% {
                opacity: 1;
                filter: brightness(120%);
            }
        }
        
        /* Additional rotation animation for the whole loader */
        .loader {
            animation: rotate 4s infinite linear;
            transform-origin: center;
        }
        
        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loader-container-bock {
            width: 200px;
            height: 200px;
    
            background: none;
            display: flex;
   align-items: center;
       justify-content: center;
        }
      .loader-container-bock  svg {
            width: 100%;
              background: none;
            height: 100%;
        }
    </style>
      <div class="loader-container">
        <div class="loader-container-bock">
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="300 50 800 800" ><style>.prefix__B{fill:#8fb9ab}.prefix__C{fill:#f4d096}.prefix__D{fill:#f08976}.prefix__E{fill:#314d63}.prefix__F{fill:#b2e8e8}      
        g {
            animation: pulse 4s infinite ease-in-out;
        }
		
        
        /* Different delays for each group to create a wave effect */
        g:nth-child(1) { animation-delay: 0s; }
        g:nth-child(2) { animation-delay: 0.5s; }
        g:nth-child(3) { animation-delay: 1s; }
        g:nth-child(4) { animation-delay: 1.5s; }
        g:nth-child(5) { animation-delay: 2s; }
       
        /* Animation keyframes */
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.03);
                opacity: 0.9;
            }
        }
        
        /* Additional styling for the standalone path elements */
        path {
            animation: glow 6s infinite alternate;
        }
        .prefix__E{
		   animation: glowopacity 2s infinite alternate;
		}
        @keyframes glow {
            from {
                filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
            }
            to {
                filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
            }
        }
		  @keyframes glowopacity {
            from {
                opacity: 1;
            }
            to {
               opacity: 0.4;
            }
        }
		
		.prefix__E path {

  position: relative;
  animation: bounce1 2s infinite;
}
		@keyframes bounce1 {
  0%, 100% {
    top: 0;
    animation-timing-function: ease-in;
  }

  50% {
    top: 100px;
    animation-timing-function: ease-out;
  }
}

.bounce2 {
  width: 50px;
  height: 50px;
  margin-left: 300px;
  background: #00bfff;
  border-radius: 50%;
  position: relative;
  animation: bounce1 0.6s infinite ease-in-out;
}

        </style>
        <g class="prefix__B"><path d="M0 0v-38h-8V2z" clip-path="url(#prefix__A)" transform="matrix(1.33333 0 0 -1.33333 489 347)"/><path d="M0 0l8-2v-35a4 4 0 00-4-4q-3 1-4 4z" clip-path="url(#prefix__B)" transform="matrix(1.33333 0 0 -1.33333 478 405)"/><path d="M0 0l-4-2-21-11a68 68 0 01-35-60v-17l-8 2v20A68 68 0 00-32-9l21 12 2 1q2-3 8-4z" clip-path="url(#prefix__C)" transform="matrix(1.33333 0 0 -1.33333 569 220)"/><path d="M0 0l-33-18-3-1h1l-2 3-6 2 4 2L-4 7q4 1 6-2 1-3-2-5" clip-path="url(#prefix__D)" transform="matrix(1.33333 0 0 -1.33333 670 167)"/></g><g class="prefix__C"><path d="M0 0l-4-2-2-1-33-18a68 68 0 01-36-60v-4a4 4 0 00-4-4q-3 0-4 4v9a68 68 0 0036 59l31 17 6 4h1l2 1V4q1-3 7-4" clip-path="url(#prefix__E)" transform="matrix(1.33333 0 0 -1.33333 622 217)"/><path d="M0 0l-23-12-2-2v1l-1 2-6 2 3 2L-4 7q4 1 6-2 1-3-2-5" clip-path="url(#prefix__F)" transform="matrix(1.33333 0 0 -1.33333 702 174)"/></g>
        <g class="prefix__D"><path d="M0 0l10-4-18-9a68 68 0 01-35-60v-69a4 4 0 00-4-4q-3 0-4 4v74A68 68 0 00-16-8z" clip-path="url(#prefix__G)" transform="matrix(1.33333 0 0 -1.33333 612 236)"/><path d="M0 0l-48-26-9 4L-4 7q4 1 6-2 1-3-2-5" clip-path="url(#prefix__H)" transform="matrix(1.33333 0 0 -1.33333 735 181)"/></g><g class="prefix__E"><path d="M0 0l-17-9-7-4-6 2-4 2-11 4-1-1-2-1h-1l-8-5 11-4 10-3-8-5-17-9a68 68 0 01-36-59v-23q0-3-4-4l-3 4v27c0 25 13 48 35 60l15 8-10 4-10 4 27 14 9-4 11-4 17 9 8-2z" clip-path="url(#prefix__I)" transform="matrix(1.33333 0 0 -1.33333 716 217)"/><path d="M0 0l-32-17h-2l-8 3L-4 7q4 1 6-2a4 4 0 00-2-5" clip-path="url(#prefix__J)" transform="matrix(1.33333 0 0 -1.33333 768 189)"/></g><path d="M0 0a4 4 0 00-4 4v115a68 68 0 0036 60l104 56a4 4 0 005-2l-1-5-100-54a68 68 0 01-36-59V4a4 4 0 00-4-4" class="prefix__F" clip-path="url(#prefix__K)" transform="matrix(1.33333 0 0 -1.33333 615 500)"/><g class="prefix__B"><path d="M0 0l10-3a68 68 0 01-32-58v-27q-1-3-4-4a4 4 0 00-4 4v32q2 36 30 56" clip-path="url(#prefix__L)" transform="matrix(1.33333 0 0 -1.33333 682 274)"/><path d="M0 0l-4-2-24-13-10 3 28 15 2 2V4q1-3 8-4" clip-path="url(#prefix__M)" transform="matrix(1.33333 0 0 -1.33333 741 253)"/>
        <path d="M0 0l-34-18-2-1-1 1q-2 3-6 3h-2l4 2L-4 7a4 4 0 006-2q1-3-2-5" clip-path="url(#prefix__N)" transform="matrix(1.33333 0 0 -1.33333 833 203)"/></g><g class="prefix__C"><path d="M0 0l-27-14z" clip-path="url(#prefix__O)" transform="matrix(1.33333 0 0 -1.33333 815 226)"/><path d="M0 0l-25-13-4-2-12-7-14-8-4-2-41-22a68 68 0 01-36-59v-63h-8v67c0 25 14 48 36 60l39 21 4 2 27 14 4 3L-4 7a4 4 0 006-2q1-3-2-5" clip-path="url(#prefix__P)" transform="matrix(1.33333 0 0 -1.33333 866 211)"/></g>
        <g class="prefix__D"><path d="M0 0l-4-2-12-7-8-4-13-7a68 68 0 01-36-59v-13q0-4-4-4-5 0-4 4v17c0 25 14 48 36 60l12 6 1 1 6 3 14 7 2 1 7-2h1z" clip-path="url(#prefix__Q)" transform="matrix(1.33333 0 0 -1.33333 815 263)"/><path d="M0 0l-28-15h-2l-1 1q-2 3-6 3h-1l4 2L-4 7a4 4 0 006-2q1-3-2-5" clip-path="url(#prefix__R)" transform="matrix(1.33333 0 0 -1.33333 899 218)"/>
        </g><g class="prefix__E"><path d="M0 0a4 4 0 00-4 4v176a68 68 0 0036 60l104 56a4 4 0 005-2l-1-5-100-54a68 68 0 01-36-59V4a4 4 0 00-4-4" clip-path="url(#prefix__S)" transform="matrix(1.33333 0 0 -1.33333 746 611)"/><path d="M0 0l-3 6 8 4 132 71q3 1 5-2l-1-5L3 0z" clip-path="url(#prefix__T)" transform="matrix(1.33333 0 0 -1.33333 744 611)"/></g><path d="M0 0a4 4 0 00-4 4v57a4 4 0 004 4 4 4 0 004-4V4a4 4 0 00-4-4" class="prefix__B" clip-path="url(#prefix__U)" transform="matrix(1.33333 0 0 -1.33333 484 556)"/><g class="prefix__C"><path d="M0 0v-14l-8 2V0a4 4 0 004 4q4-1 4-4" clip-path="url(#prefix__V)" transform="matrix(1.33333 0 0 -1.33333 521 348)"/><path d="M0 0h8v-176l-4-3q-3 0-4 3z" clip-path="url(#prefix__W)" transform="matrix(1.33333 0 0 -1.33333 511 400)"/></g><path d="M0 0a4 4 0 00-4 4v91a4 4 0 108 0V4a4 4 0 00-4-4" class="prefix__D" clip-path="url(#prefix__X)" transform="matrix(1.33333 0 0 -1.33333 549 574)"/><path d="M0 0a4 4 0 00-4 4v114a4 4 0 004 4 4 4 0 004-4V4a4 4 0 00-4-4" class="prefix__E" clip-path="url(#prefix__Y)" transform="matrix(1.33333 0 0 -1.33333 582 547)"/>
        <path d="M0 0a4 4 0 00-4 4v56a4 4 0 004 4 4 4 0 004-4V4a4 4 0 00-4-4" class="prefix__F" clip-path="url(#prefix__Z)" transform="matrix(1.33333 0 0 -1.33333 615 593)"/><path d="M0 0a4 4 0 00-4 4v111a4 4 0 108 0V4a4 4 0 00-4-4" class="prefix__B" clip-path="url(#prefix__a)" transform="matrix(1.33333 0 0 -1.33333 647 562)"/><path d="M0 0v-95q0-4-4-4a4 4 0 00-4 4V1z" class="prefix__C" clip-path="url(#prefix__b)" transform="matrix(1.33333 0 0 -1.33333 685 481)"/><g class="prefix__D"><path d="M0 0v-20l-8 1V0q1 4 4 4 4 0 4-4" clip-path="url(#prefix__c)" transform="matrix(1.33333 0 0 -1.33333 718 408)"/><path d="M0 0v-41l-8 2V0z" clip-path="url(#prefix__d)" transform="matrix(1.33333 0 0 -1.33333 718 443)"/><path d="M0 0l8-1v-142q-1-3-4-4-4 0-4 4z" clip-path="url(#prefix__e)" transform="matrix(1.33333 0 0 -1.33333 708 504)"/></g><path d="M0 0a4 4 0 00-4 4v214a4 4 0 004 4 4 4 0 004-4V4a4 4 0 00-4-4" class="prefix__E" clip-path="url(#prefix__f)" transform="matrix(1.33333 0 0 -1.33333 929 512)"/><g class="prefix__C"><path d="M0 0v-41l-8 2-17 3-7 1v8l7-1 17-3v24l-24 5v8l7-2z" clip-path="url(#prefix__g)" transform="matrix(1.33333 0 0 -1.33333 718 443)"/><path d="M0 0v-24l24-8v-7l-7 2-25 7v41l8-3 17-4 7-3v-8l-7 2z" clip-path="url(#prefix__h)" transform="matrix(1.33333 0 0 -1.33333 489 358)"/></g><path d="M0 0a6 6 0 01-6-6 6 6 0 016-7q6 1 6 7a6 6 0 01-6 6m0-18A11 11 0 100 5a11 11 0 000-23" class="prefix__B" clip-path="url(#prefix__i)" transform="matrix(1.33333 0 0 -1.33333 484 556)"/>
        <path d="M0 0q-6-1-6-6a6 6 0 016-7 6 6 0 016 7q0 5-6 6m0-18A11 11 0 00-11-6 11 11 0 000 5a11 11 0 000-23" class="prefix__C" clip-path="url(#prefix__j)" transform="matrix(1.33333 0 0 -1.33333 516 640)"/><path d="M0 0a6 6 0 010-13 6 6 0 016 7q0 5-6 6m0-18A11 11 0 1011-6 11 11 0 000-18" class="prefix__D" clip-path="url(#prefix__k)" transform="matrix(1.33333 0 0 -1.33333 549 574)"/><path d="M0 0a6 6 0 116-6 6 6 0 01-6 6m0-18A11 11 0 000 5 11 11 0 0011-6Q10-17 0-18" class="prefix__E" clip-path="url(#prefix__l)" transform="matrix(1.33333 0 0 -1.33333 582 547)"/><path d="M0 0a6 6 0 01-6-6q0-6 6-7a6 6 0 016 7 6 6 0 01-6 6m0-18A11 11 0 100 5a11 11 0 000-23" class="prefix__F" clip-path="url(#prefix__m)" transform="matrix(1.33333 0 0 -1.33333 615 593)"/><path d="M0 0a6 6 0 110-13A6 6 0 010 0m0-18A11 11 0 100 5a11 11 0 000-23" class="prefix__B" clip-path="url(#prefix__n)" transform="matrix(1.33333 0 0 -1.33333 647 562)"/><path d="M0 0a6 6 0 110-13A6 6 0 010 0m0-18A11 11 0 100 5a11 11 0 000-23" class="prefix__C" clip-path="url(#prefix__o)" transform="matrix(1.33333 0 0 -1.33333 680 613)"/><g class="prefix__D"><path d="M0 0a6 6 0 110-13A6 6 0 010 0m0-18A11 11 0 100 5a11 11 0 000-23" clip-path="url(#prefix__p)" transform="matrix(1.33333 0 0 -1.33333 713 701)"/><path d="M0 0q-6 1-7 4 0 5 7 5l7-2V6l1-1Q7 0 0 0m10 6L8 9l-4 2H0q-9 0-10-7c-1-7 4-6 10-6q10 1 10 7z" clip-path="url(#prefix__q)" transform="matrix(1.33333 0 0 -1.33333 849 245)"/>
        <path d="M0 0q-5 0-7 3v1q1 5 7 5l7-2 1-3q0-3-7-4m7 8q-3 4-8 3-9-1-10-7l1-2q2-4 8-4l1-1q9 1 9 7z" clip-path="url(#prefix__r)" transform="matrix(1.33333 0 0 -1.33333 813 262)"/></g><g class="prefix__B"><path d="M0 0q-6 1-7 4 0 4 5 5h2l6-2 1-2h1Q7 0 0 0m10 6L8 9l-5 2H0q-9 0-10-7 1-5 10-6 10 1 10 7z" clip-path="url(#prefix__s)" transform="matrix(1.33333 0 0 -1.33333 775 236)"/><path d="M0 0q-7 1-8 4v1q2 4 8 4l6-2 1-2Q6 0 0 0m8 9l-8 2q-9 0-10-7V3q1-3 6-5h4q10 0 10 7z" clip-path="url(#prefix__t)" transform="matrix(1.33333 0 0 -1.33333 741 253)"/></g><g class="prefix__C"><path d="M0 0q-6 1-7 4 0 5 7 5l7-2 1-2-1-1q0-3-7-4m10 5L8 9l-4 2H0q-9 0-10-7c-1-7 4-6 10-6q10 1 10 7" clip-path="url(#prefix__u)" transform="matrix(1.33333 0 0 -1.33333 659 197)"/><path d="M0 0q-7 1-7 4v1q1 4 7 4l7-2 1-2Q7 0 0 0m8 9l-8 2q-9 0-10-7 2-4 6-6h4q10 0 10 7z" clip-path="url(#prefix__v)" transform="matrix(1.33333 0 0 -1.33333 622 217)"/></g>
        <g class="prefix__B"><path d="M0 0q-6 1-7 4 0 5 7 5l7-2 1-2-1-1q0-3-7-4m10 5L8 9l-4 2H0q-9 0-10-7c-1-7 4-6 10-6q10 1 10 7" clip-path="url(#prefix__w)" transform="matrix(1.33333 0 0 -1.33333 612 197)"/><path d="M0 0h-1q-6 1-8 4 1 5 8 5l6-2 1-3q0-3-6-4m7 8q-3 3-8 3-10-1-10-7V3q1-5 7-5l3-1Q8-2 9 4z" clip-path="url(#prefix__x)" transform="matrix(1.33333 0 0 -1.33333 569 220)"/></g><g class="prefix__E"><path d="M0 0l-16-9v-1q9 3 16 9z" clip-path="url(#prefix__y)" transform="matrix(1.33333 0 0 -1.33333 781 331)"/><path d="M0 0l6 2 5 3 11 7 11 5 4 3q3 6 6 5l1 1q-3 1-4-1l-6-4-11-6-11-7-6-3z" clip-path="url(#prefix__z)" transform="matrix(1.33333 0 0 -1.33333 785 331)"/><path d="M0 0l10 5 19 11L9 6 0 2q-4-1-9-6v-1l5 3z" clip-path="url(#prefix__AA)" transform="matrix(1.33333 0 0 -1.33333 772 370)"/>
        <path d="M0 0l-10-7v-1q6 5 11 6l9 3v2z" clip-path="url(#prefix__AB)" transform="matrix(1.33333 0 0 -1.33333 827 338)"/><path d="M0 0l-13-7-6-3-6-3v-1q13 4 25 13z" clip-path="url(#prefix__AC)" transform="matrix(1.33333 0 0 -1.33333 794 387)"/><path d="M0 0l4 1v1z" clip-path="url(#prefix__AD)" transform="matrix(1.33333 0 0 -1.33333 798 386)"/><path d="M0 0l2 1z" clip-path="url(#prefix__AE)" transform="matrix(1.33333 0 0 -1.33333 804 383)"/><path d="M0 0q-2-2-5-2l-5-3-10-7 10 4L0-1z" clip-path="url(#prefix__AF)" transform="matrix(1.33333 0 0 -1.33333 843 361)"/><path d="M0 0h-5l-5-4-6-4-6-1-11-6q-6-1-10-8v-1q5 6 11 8l12 5 6 1 5 4q2 3 5 3 3-2 4 2z" clip-path="url(#prefix__AG)" transform="matrix(1.33333 0 0 -1.33333 818 415)"/><path d="M0 0l-4-3v-1l4 3z" clip-path="url(#prefix__AI)" transform="matrix(1.33333 0 0 -1.33333 833 404)"/>
        <path d="M0 0l-15-9v-1z" clip-path="url(#prefix__AJ)" transform="matrix(1.33333 0 0 -1.33333 858 286)"/><path d="M0 0l6 2 5 3 11 7 11 5 4 3c2 2 4 6 6 4v2q-1 1-3-1l-6-5-11-5-11-7-6-3z" clip-path="url(#prefix__AK)" transform="matrix(1.33333 0 0 -1.33333 861 286)"/><path d="M0 0l10 5 18 10v1L9 6 0 2q-4-1-9-6v-1l5 3z" clip-path="url(#prefix__AL)" transform="matrix(1.33333 0 0 -1.33333 849 325)"/><path d="M0 0l-10-7v-1q6 5 11 6l9 3v2z" clip-path="url(#prefix__AM)" transform="matrix(1.33333 0 0 -1.33333 904 293)"/><path d="M0 0l-13-7-6-3-6-3v-1q13 4 25 13z" clip-path="url(#prefix__AN)" transform="matrix(1.33333 0 0 -1.33333 872 342)"/><path d="M0 0l4 1v1z" clip-path="url(#prefix__AO)" transform="matrix(1.33333 0 0 -1.33333 875 341)"/><path d="M0 0l2 1z" clip-path="url(#prefix__AP)" transform="matrix(1.33333 0 0 -1.33333 881 338)"/><path d="M0 0q-2-2-5-2l-4-3-11-7q6 0 10 4L0-1z" clip-path="url(#prefix__AQ)" transform="matrix(1.33333 0 0 -1.33333 919 316)"/><path d="M0 0l-5-1q-3 0-5-3l-6-4-6-1-11-5q-6-2-10-9v-1q6 6 11 8l12 5 6 1 5 4q3 3 5 3 3-2 4 2z" clip-path="url(#prefix__AR)" transform="matrix(1.33333 0 0 -1.33333 895 370)"/><path d="M0 0l-4-3v-1l4 3z" clip-path="url(#prefix__AT)" transform="matrix(1.33333 0 0 -1.33333 911 359)"/><path d="M0 0l-16-9v-2z" clip-path="url(#prefix__AU)" transform="matrix(1.33333 0 0 -1.33333 780 462)"/><path d="M0 0l6 2 5 4 12 6 10 6q3 0 5 3c2 2 4 6 6 4v2q-1 1-3-1l-6-5-11-6-12-6-6-4z" clip-path="url(#prefix__AV)" transform="matrix(1.33333 0 0 -1.33333 784 462)"/><path d="M0 0l10 5 19 10v1L10 6 0 2q-4-1-9-6v-1l5 2z" clip-path="url(#prefix__AW)" transform="matrix(1.33333 0 0 -1.33333 771 502)"/><path d="M0 0l-10-7v-1q6 5 11 6l9 3v2z" clip-path="url(#prefix__AX)" transform="matrix(1.33333 0 0 -1.33333 827 469)"/>
        <path d="M0 0l-13-7-7-3-6-3v-1q13 4 26 13z" clip-path="url(#prefix__AY)" transform="matrix(1.33333 0 0 -1.33333 794 521)"/><path d="M0 0l4 1v1z" clip-path="url(#prefix__AZ)" transform="matrix(1.33333 0 0 -1.33333 797 520)"/><path d="M0 0l2 1z" clip-path="url(#prefix__Aa)" transform="matrix(1.33333 0 0 -1.33333 804 516)"/><path d="M0 0q-2-2-5-2l-5-3-10-7 10 4L0-1z" clip-path="url(#prefix__Ab)" transform="matrix(1.33333 0 0 -1.33333 843 493)"/><path d="M0 0h-5l-5-4-6-4-6-2-12-5q-5-2-10-8v-2q6 6 11 8l13 5 5 2 5 4 6 3q3-2 4 2z" clip-path="url(#prefix__Ac)" transform="matrix(1.33333 0 0 -1.33333 818 550)"/><path d="M0 0l-4-3v-1l4 3z" clip-path="url(#prefix__Ae)" transform="matrix(1.33333 0 0 -1.33333 833 538)"/><path d="M0 0l-16-9v-2z" clip-path="url(#prefix__Af)" transform="matrix(1.33333 0 0 -1.33333 858 416)"/><path d="M0 0l6 2 5 3 12 7 10 6q2 0 5 3c2 2 4 6 6 4v2q-1 1-4-1l-5-5q-6-2-11-6L12 8 6 5z" clip-path="url(#prefix__Ag)" transform="matrix(1.33333 0 0 -1.33333 862 416)"/><path d="M0 0l10 5 19 10v1L9 6 0 2q-4-1-9-6v-1l5 2z" clip-path="url(#prefix__Ah)" transform="matrix(1.33333 0 0 -1.33333 850 456)"/><path d="M0 0l-10-7v-1q6 5 11 6l9 3v2z" clip-path="url(#prefix__Ai)" transform="matrix(1.33333 0 0 -1.33333 905 423)"/><path d="M0 0l-13-7-6-3-6-3v-1q12 4 25 13z" clip-path="url(#prefix__Aj)" transform="matrix(1.33333 0 0 -1.33333 872 474)"/><path d="M0 0l4 1v1z" clip-path="url(#prefix__Ak)" transform="matrix(1.33333 0 0 -1.33333 876 473)"/><path d="M0 0l2 1z" clip-path="url(#prefix__Al)" transform="matrix(1.33333 0 0 -1.33333 882 470)"/><path d="M0 0q-2-2-5-2l-5-3-10-7q5 0 10 4L0-1z" clip-path="url(#prefix__Am)" transform="matrix(1.33333 0 0 -1.33333 921 447)"/><path d="M0 0h-5l-5-4-6-4-6-2-12-5q-5-2-10-8v-2q6 6 12 8l12 5 5 2 5 4 6 3q3-2 4 2z" clip-path="url(#prefix__An)" transform="matrix(1.33333 0 0 -1.33333 897 503)"/><path d="M0 0l-4-3v-1l4 3z" clip-path="url(#prefix__Ap)" transform="matrix(1.33333 0 0 -1.33333 912 492)"/></g></svg>
    </div></div>
  `);

  // 2. Remove loader when page fully loaded
   window.addEventListener('load', function () {
    // Add 2 seconds extra delay (2000 ms)
    setTimeout(function () {
      const loader = document.querySelector('.loader-container');
      if (loader) loader.style.display = 'none';
    }, 1500); // 2 seconds delay
  });
})();