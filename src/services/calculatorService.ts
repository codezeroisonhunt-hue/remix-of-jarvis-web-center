
interface CalculatorResult {
  result: number | string;
  expression: string;
  steps?: string[];
  error?: string;
}

// Check if a message is a calculation request
export const isCalculationRequest = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Basic patterns for calculation requests
  const calculationPatterns = [
    /calculate\s+/i,
    /compute\s+/i,
    /what\s+is\s+[\d\s\+\-\*\/\(\)\.]+/i,
    /solve\s+[\d\s\+\-\*\/\(\)\.]+/i,
    /\d+\s*[\+\-\*\/]\s*\d+/,
    /convert\s+[\d\.]+\s+\w+\s+to\s+\w+/i,
    /what\s+is\s+\d+%\s+of\s+\d+/i
  ];
  
  return calculationPatterns.some(pattern => pattern.test(lowerMessage));
};

// Process a calculation request
export const processCalculation = (message: string): CalculatorResult => {
  const lowerMessage = message.toLowerCase();
  
  try {
    // Unit conversion
    const conversionMatch = lowerMessage.match(/convert\s+([\d\.]+)\s+(\w+)\s+to\s+(\w+)/i);
    if (conversionMatch) {
      return handleUnitConversion(
        parseFloat(conversionMatch[1]), 
        conversionMatch[2], 
        conversionMatch[3]
      );
    }
    
    // Percentage calculations
    const percentageMatch = lowerMessage.match(/what\s+is\s+([\d\.]+)%\s+of\s+([\d\.]+)/i);
    if (percentageMatch) {
      const percentage = parseFloat(percentageMatch[1]);
      const value = parseFloat(percentageMatch[2]);
      const result = (percentage / 100) * value;
      
      return {
        result,
        expression: `${percentage}% of ${value}`,
        steps: [`${percentage}% = ${percentage/100}`, `${percentage/100} × ${value} = ${result}`]
      };
    }
    
    // Extract mathematical expression from the message
    let expression = extractExpression(message);
    
    // Calculate the result
    const result = evaluateExpression(expression);
    
    return {
      result,
      expression
    };
  } catch (error) {
    console.error('Calculation error:', error);
    return {
      result: "Error",
      expression: message,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Extract a mathematical expression from a message
const extractExpression = (message: string): string => {
  // Remove common phrases and words
  let expression = message
    .replace(/calculate|compute|what is|solve|the result of|equals|equal to/gi, '')
    .trim();
  
  // Handle words like "plus", "minus", "times", "divided by"
  expression = expression
    .replace(/plus/gi, '+')
    .replace(/minus/gi, '-')
    .replace(/times/gi, '*')
    .replace(/multiplied by/gi, '*')
    .replace(/divided by/gi, '/')
    .replace(/squared/gi, '^2')
    .replace(/cubed/gi, '^3');
  
  return expression;
};

// Safely evaluate a mathematical expression
const evaluateExpression = (expression: string): number => {
  // Basic security check - only allow numbers, operators, and basic math functions
  if (!/^[\d\s\+\-\*\/\(\)\.\^\s]*$/.test(expression)) {
    throw new Error('Invalid expression');
  }
  
  // Replace ^ with ** for exponentiation
  expression = expression.replace(/\^/g, '**');
  
  // Use Function constructor for calculation
  // Note: In a real-world app, you'd want to use a safer math library like math.js
  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${expression})`)();
  } catch (error) {
    throw new Error('Could not evaluate the expression');
  }
};

// Handle unit conversions
const handleUnitConversion = (
  value: number, 
  fromUnit: string, 
  toUnit: string
): CalculatorResult => {
  // Normalize units
  fromUnit = fromUnit.toLowerCase();
  toUnit = toUnit.toLowerCase();
  
  // Temperature conversions
  if (isTemperatureUnit(fromUnit) && isTemperatureUnit(toUnit)) {
    return convertTemperature(value, fromUnit, toUnit);
  }
  
  // Length conversions
  if (isLengthUnit(fromUnit) && isLengthUnit(toUnit)) {
    return convertLength(value, fromUnit, toUnit);
  }
  
  // Weight conversions
  if (isWeightUnit(fromUnit) && isWeightUnit(toUnit)) {
    return convertWeight(value, fromUnit, toUnit);
  }
  
  // Volume conversions
  if (isVolumeUnit(fromUnit) && isVolumeUnit(toUnit)) {
    return convertVolume(value, fromUnit, toUnit);
  }
  
  return {
    result: "Unsupported conversion",
    expression: `${value} ${fromUnit} to ${toUnit}`,
    error: "I don't know how to convert between these units."
  };
};

// Helper functions for unit conversions
const isTemperatureUnit = (unit: string): boolean => {
  return ['c', 'celsius', 'f', 'fahrenheit', 'k', 'kelvin'].includes(unit);
};

const isLengthUnit = (unit: string): boolean => {
  return ['mm', 'millimeter', 'cm', 'centimeter', 'm', 'meter', 'km', 'kilometer',
          'in', 'inch', 'ft', 'foot', 'feet', 'yd', 'yard', 'mi', 'mile'].includes(unit);
};

const isWeightUnit = (unit: string): boolean => {
  return ['mg', 'milligram', 'g', 'gram', 'kg', 'kilogram',
          'oz', 'ounce', 'lb', 'pound', 'st', 'stone', 't', 'ton'].includes(unit);
};

const isVolumeUnit = (unit: string): boolean => {
  return ['ml', 'milliliter', 'l', 'liter', 'gal', 'gallon', 'pt', 'pint',
          'qt', 'quart', 'fl oz', 'fluid ounce'].includes(unit);
};

const convertTemperature = (value: number, from: string, to: string): CalculatorResult => {
  let celsius: number;
  
  // Convert to Celsius first
  if (from.startsWith('c')) {
    celsius = value;
  } else if (from.startsWith('f')) {
    celsius = (value - 32) * (5/9);
  } else { // Kelvin
    celsius = value - 273.15;
  }
  
  // Convert from Celsius to target unit
  let result: number;
  if (to.startsWith('c')) {
    result = celsius;
  } else if (to.startsWith('f')) {
    result = celsius * (9/5) + 32;
  } else { // Kelvin
    result = celsius + 273.15;
  }
  
  const fromUnit = from.startsWith('c') ? 'Celsius' : from.startsWith('f') ? 'Fahrenheit' : 'Kelvin';
  const toUnit = to.startsWith('c') ? 'Celsius' : to.startsWith('f') ? 'Fahrenheit' : 'Kelvin';
  
  return {
    result,
    expression: `${value} ${fromUnit} to ${toUnit}`,
    steps: [`Converted ${value}${fromUnit.charAt(0)} to ${result.toFixed(2)}${toUnit.charAt(0)}`]
  };
};

const convertLength = (value: number, from: string, to: string): CalculatorResult => {
  // Convert everything to meters first
  const lengthInMeters = convertToMeters(value, from);
  
  // Then convert from meters to the target unit
  const result = convertFromMeters(lengthInMeters, to);
  
  return {
    result,
    expression: `${value} ${from} to ${to}`,
    steps: [`Converted ${value} ${from} to ${result.toFixed(4)} ${to}`]
  };
};

const convertToMeters = (value: number, unit: string): number => {
  switch (unit) {
    case 'mm': case 'millimeter': return value * 0.001;
    case 'cm': case 'centimeter': return value * 0.01;
    case 'm': case 'meter': return value;
    case 'km': case 'kilometer': return value * 1000;
    case 'in': case 'inch': return value * 0.0254;
    case 'ft': case 'foot': case 'feet': return value * 0.3048;
    case 'yd': case 'yard': return value * 0.9144;
    case 'mi': case 'mile': return value * 1609.344;
    default: return value;
  }
};

const convertFromMeters = (meters: number, unit: string): number => {
  switch (unit) {
    case 'mm': case 'millimeter': return meters / 0.001;
    case 'cm': case 'centimeter': return meters / 0.01;
    case 'm': case 'meter': return meters;
    case 'km': case 'kilometer': return meters / 1000;
    case 'in': case 'inch': return meters / 0.0254;
    case 'ft': case 'foot': case 'feet': return meters / 0.3048;
    case 'yd': case 'yard': return meters / 0.9144;
    case 'mi': case 'mile': return meters / 1609.344;
    default: return meters;
  }
};

// Similar functions for weight and volume conversions
const convertWeight = (value: number, from: string, to: string): CalculatorResult => {
  // Convert to grams first
  const weightInGrams = convertToGrams(value, from);
  
  // Then convert from grams to target unit
  const result = convertFromGrams(weightInGrams, to);
  
  return {
    result,
    expression: `${value} ${from} to ${to}`,
    steps: [`Converted ${value} ${from} to ${result.toFixed(4)} ${to}`]
  };
};

const convertToGrams = (value: number, unit: string): number => {
  switch (unit) {
    case 'mg': case 'milligram': return value * 0.001;
    case 'g': case 'gram': return value;
    case 'kg': case 'kilogram': return value * 1000;
    case 'oz': case 'ounce': return value * 28.35;
    case 'lb': case 'pound': return value * 453.592;
    case 'st': case 'stone': return value * 6350.29;
    case 't': case 'ton': return value * 907185;
    default: return value;
  }
};

const convertFromGrams = (grams: number, unit: string): number => {
  switch (unit) {
    case 'mg': case 'milligram': return grams / 0.001;
    case 'g': case 'gram': return grams;
    case 'kg': case 'kilogram': return grams / 1000;
    case 'oz': case 'ounce': return grams / 28.35;
    case 'lb': case 'pound': return grams / 453.592;
    case 'st': case 'stone': return grams / 6350.29;
    case 't': case 'ton': return grams / 907185;
    default: return grams;
  }
};

const convertVolume = (value: number, from: string, to: string): CalculatorResult => {
  // Convert to liters first
  const volumeInLiters = convertToLiters(value, from);
  
  // Then convert from liters to target unit
  const result = convertFromLiters(volumeInLiters, to);
  
  return {
    result,
    expression: `${value} ${from} to ${to}`,
    steps: [`Converted ${value} ${from} to ${result.toFixed(4)} ${to}`]
  };
};

const convertToLiters = (value: number, unit: string): number => {
  switch (unit) {
    case 'ml': case 'milliliter': return value * 0.001;
    case 'l': case 'liter': return value;
    case 'gal': case 'gallon': return value * 3.78541;
    case 'pt': case 'pint': return value * 0.473176;
    case 'qt': case 'quart': return value * 0.946353;
    case 'fl oz': case 'fluid ounce': return value * 0.0295735;
    default: return value;
  }
};

const convertFromLiters = (liters: number, unit: string): number => {
  switch (unit) {
    case 'ml': case 'milliliter': return liters / 0.001;
    case 'l': case 'liter': return liters;
    case 'gal': case 'gallon': return liters / 3.78541;
    case 'pt': case 'pint': return liters / 0.473176;
    case 'qt': case 'quart': return liters / 0.946353;
    case 'fl oz': case 'fluid ounce': return liters / 0.0295735;
    default: return liters;
  }
};
