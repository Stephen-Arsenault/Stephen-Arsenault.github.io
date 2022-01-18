  window.onload = function(){
    frequency = localStorage.getItem('frequency') || parseFloat(document.querySelector("#frequency").value) || 15667000;
    resistanceSlider = localStorage.getItem('resistanceSlider') || parseFloat(document.getElementById('resistanceSlider').value) || 1582.8428;
    mode = localStorage.getItem('mode') || 1500;
  
    const inputFrequency = document.getElementById('frequency');
    const inputResistanceSlider = document.querySelector('#resistanceSlider');
    const resistanceReadout = document.querySelector('#resistanceReadout');

    inputResistanceSlider.value = resistanceSlider;
   	inputFrequency.value = frequency;
   	resistanceReadout.innerText = `${resistanceSlider} Ω`;
  
    inputFrequency.onkeydown = function(){
      frequency = parseFloat(document.getElementById('frequency').value);
      localStorage.setItem('frequency', frequency);
    };

    inputResistanceSlider.oninput = function(){
    	calc();
    }

    document.querySelectorAll("input[name='mode']").forEach((input) => {
        input.addEventListener('change', function() {
        	calc();
        	if (this.value === mode) {
        		this.checked = true;
        	}
        });
    });

    calc();
  }

  function calc() {
  	// Inputs
  	const resistance = parseFloat(document.getElementById('resistanceSlider').value);
  	const frequencyField = document.querySelector("[id='frequency]");
  	const resistanceReadout = document.querySelector('#resistanceReadout');

  	let modeResistance;
    document.querySelectorAll("input[name='mode']").forEach((input) => {
        	if (input.checked) {
        		modeResistance = parseFloat(input.value);
        	}
        });

	// Base Values
  	const baseFrequency = 10000000; // 10 MHz
  	const baseResistance = 10000;   // 10 Kilo Ohm
  	const baseMultiplier = 1;

  	// Derivatives
  	const R1 = 3300; // Ohms
  	const totalResistance = resistance + R1 + modeResistance;

  	// Equations
  	const frequencyEquation = baseFrequency * ((baseResistance / (totalResistance)) * 1/baseMultiplier);
  	const resistanceEquation = '';


  	const computedFrequency = Math.round((frequencyEquation + Number.EPSILON) * 1) / 1;
  	const readoutResistance = Math.round((totalResistance + Number.EPSILON) * 100) / 100;

	localStorage.setItem('frequency', `${computedFrequency} Hz`);
	localStorage.setItem('resistanceSlider', resistance);

	document.getElementById('frequency').innerText = `${computedFrequency} Hz`;
    document.getElementById("bgText").innerText = hertz(computedFrequency);

	resistanceReadout.innerText = `${readoutResistance} Ω`;
  }

  function hertz(hz) {
  	if (!hz) {
  		return;
  	}
  	const digits = hz.toString().length;
  	switch (digits) {
  		case 1:
  		case 2:
  		case 3: // Hz 
  			return `${hz} Hz`;
		case 4:
 		case 5:
 		case 6: // KHz
  			return `${Math.round(((hz / 1000) + Number.EPSILON) * 100) / 100} KHz`;
		case 7:
		case 8:
		case 9: // MHz
  			return `${Math.round(((hz / 1000000) + Number.EPSILON) * 100) / 100} MHz`;
  		case 10:
  		case 11:
  		case 12: // GHz
  		    return `${Math.round(((hz / 1000000000) + Number.EPSILON) * 100) / 100} GHz`;
  		default: {
  			console.log('defaultCase');
  			return `${hz} Hz`;
  		}
  	}
  }