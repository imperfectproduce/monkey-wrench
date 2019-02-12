import _isNil from 'lodash/isNil';

export const getNutritionLabelConfig = nutrition => {
  const showLegacyVersion = nutrition.nutritionLabelUI !== '2018';

  const showVitaminA = !_isNil(nutrition.nf_vitamin_a_dv) || !_isNil(nutrition.nf_vitamin_a_iu_dv);
  const valueVitaminA = nutrition.nf_vitamin_a_dv ? nutrition.nf_vitamin_a_dv : nutrition.nf_vitamin_a_iu_dv;
  const valueVitaminD = showLegacyVersion ? nutrition.nf_vitamin_d : nutrition.nf_vitamin_d_dv;

  return {
    showLegacyVersion,
    allowCustomWidth: false,
    allowNoBorder: false,
    showItemName: false,
    // showAmountPerServing: !_isNil(nutrition.showAmountPerServing),
    // allowFDARounding: true,
    // showServingsPerContainer: false,
    showServingUnitQuantity: !_isNil(nutrition.serving_qty),
    showServingUnitQuantityTextbox: true,
    // showBrandName: false,
    showCalories: !_isNil(nutrition.nf_calories),
    showFatCalories: !_isNil(nutrition.nf_calories),
    showTotalFat: !_isNil(nutrition.nf_total_fat),
    showSatFat: !_isNil(nutrition.nf_saturated_fat),
    showTransFat: !_isNil(nutrition.nf_trans_fat),
    showPolyFat: !_isNil(nutrition.nf_poly_fat),
    showMonoFat: !_isNil(nutrition.nf_mono_fat),
    showCholesterol: !_isNil(nutrition.nf_cholesterol),
    showSodium: !_isNil(nutrition.nf_sodium),
    showTotalCarb: !_isNil(nutrition.nf_total_carbohydrate),
    showFibers: !_isNil(nutrition.nf_dietary_fiber),
    showSugars: !_isNil(nutrition.nf_sugars),
    showProteins: !_isNil(nutrition.nf_protein),
    showVitaminA: !_isNil(nutrition.nf_vitamin_a),
    showVitaminC: !_isNil(nutrition.nf_vitamin_c),
    showCalcium: !_isNil(nutrition.nf_calcium_dv),
    showIron: !_isNil(nutrition.nf_iron_dv),
    showPotassium: showLegacyVersion && !_isNil(nutrition.nf_potassium),
    showPotassium_2018: !showLegacyVersion && !_isNil(nutrition.nf_potassium_dv),
    showAddedSugars: !_isNil(nutrition.nf_added_sugars),
    showVitaminD: !_isNil(valueVitaminD),

    valueServingUnitQuantity: nutrition.serving_qty,
    valueServingSizeUnit: nutrition.serving_unit,
    valueServingWeightGrams: nutrition.serving_weight_grams,
    valueCalories: nutrition.nf_calories,
    valueFatCalories: nutrition.nf_total_fat * 9,
    valueTotalFat: nutrition.nf_total_fat,
    valueSatFat: nutrition.nf_saturated_fat,
    valueTransFat: nutrition.nf_trans_fat,
    valuePolyFat: nutrition.nf_poly_fat,
    valueMonoFat: nutrition.nf_mono_fat,
    valueCholesterol: nutrition.nf_cholesterol,
    valueSodium: nutrition.nf_sodium,
    valueTotalCarb: nutrition.nf_total_carbohydrate,
    valueFibers: nutrition.nf_dietary_fiber,
    valueSugars: nutrition.nf_sugars,
    valueProteins: nutrition.nf_protein,
    valueVitaminA: valueVitaminA,
    valueVitaminC: nutrition.nf_vitamin_c,
    valueVitaminD: valueVitaminD,
    valueCalcium: nutrition.nf_calcium_dv,
    valueIron: nutrition.nf_iron_dv,
    valuePotassium: nutrition.nf_potassium,
    valuePotassium_2018: nutrition.nf_potassium_dv,
    valueAddedSugars: nutrition.nf_added_sugars,

    // showIngredients: !_isNil(nutrition.nf_ingredient_statement),
    showIngredients: false,
    ingredientList: nutrition.nf_ingredient_statement,

    showDisclaimer: true,
    valueDisclaimer: '<br />(Note: This Product Description Is Informational Only. Always Check The Actual Product Label In Your Possession For The Most Accurate Ingredient Information Before Use. For Any Health Or Dietary Related Matter Always Consult Your Doctor Before Use.)'
  }
}
