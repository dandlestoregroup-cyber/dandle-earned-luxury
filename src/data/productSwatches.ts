/* Prompt 2F: 7 swatches per product */

// Each product gets 7 colors from PALETTE_14
export const productSwatches: Record<string, string[]> = {
  'relaxmax': ['nile-sapphire', 'desert-sage', 'nile-mist', 'giza-gold', 'oasis-green'],
  'comfortplus': ['alexandria-linen', 'desert-grey', 'amber-sand', 'coastal-fog', 'papyrus-stripe', 'clay-pottery', 'mocha-taupe'],
  'diva': ['nile-sapphire', 'nile-mist', 'sandstorm-ochre', 'blue-nile-denim'],
  'cozycompanion': ['alexandria-linen', 'mocha-taupe', 'coastal-fog', 'amber-sand', 'papyrus-stripe', 'desert-grey', 'clay-pottery'],
  'easyup': ['desert-grey', 'coastal-fog', 'mocha-taupe', 'amber-sand', 'alexandria-linen', 'papyrus-stripe', 'nile-sapphire'],
  'easyup-compact': ['nile-sapphire', 'desert-grey', 'mocha-taupe'], // Limited to 3 colors: Navy Blue, Stone Grey, Espresso Brown
  'worknest': ['blue-nile-denim', 'desert-grey', 'coastal-fog', 'nile-sapphire', 'oasis-green', 'mocha-taupe', 'amber-sand'],
  'spacesaver': ['nile-mist', 'alexandria-linen', 'desert-sage', 'papyrus-stripe', 'amber-sand', 'giza-gold', 'sandstorm-ochre'],
  'complete-set': ['alexandria-linen', 'mocha-taupe', 'desert-sage', 'coastal-fog', 'nile-mist', 'amber-sand', 'papyrus-stripe'],
};
