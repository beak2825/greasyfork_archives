
//GETTING TRIGRAMS:
function getTrigrams(value) {
  const trigrams = [];
  // Pad the string to handle edge cases for shorter strings and beginning/end trigrams
  const paddedValue = ' ' + value + ' '; 

  for (let i = 0; i < paddedValue.length - 2; i++) {
    trigrams.push(paddedValue.substring(i, i + 3));
  }
  return trigrams;
  }//Closing getTrigrams()-Function

  
function trigramSimilarity(stringA, stringB) {
  if (stringA === stringB) {
    return 1; // Strings are identical
  }

  const trigramsA = new Set(getTrigrams(stringA.toLowerCase())); // Convert to lowercase for case-insensitive comparison
  const trigramsB = new Set(getTrigrams(stringB.toLowerCase()));

  let commonTrigramsCount = 0;
  for (const trigram of trigramsA) {
    if (trigramsB.has(trigram)) {
      commonTrigramsCount++;
    }
  }

  const totalUniqueTrigrams = trigramsA.size + trigramsB.size - commonTrigramsCount;

  if (totalUniqueTrigrams === 0) {
    return 0; // Avoid division by zero if both strings are empty or result in no trigrams
  }

  return commonTrigramsCount / totalUniqueTrigrams;
  }//Closing-trigramSimilarity()-Function
  
  
  
  //SEARCHING CLOSEST MATCH:
  function findClosestMatchTrigrams(targetString, stringArray) {
        let closestMatch = null;
        let highestSimilarity = -1;

        for (const str of stringArray) {
            const similarity = trigramSimilarity(targetString, str);
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                closestMatch = str;
            }
        }

        return {
            closestMatch: closestMatch,
            similarityFraction: highestSimilarity
        };
    }//Closing-findClosestMatchTrigrams()-Function
    
    
    
    
    
    
    