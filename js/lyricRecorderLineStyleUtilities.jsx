﻿{
 var lyricRecorderLineStyleUtilities=
        {
              removePunctuation:function(originalString)
                {
                    var punctuationless = originalString.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                    var finalString = punctuationless.replace(/\s{2,}/g," ");
                    return finalString;
                },

                 setPositionAndScale:function(word,wordXPosition,wordYPosition,scalingXAmount,scalingYAmount)
                {
                        word.afterEffectsTextLayer.property("Position").setValueAtTime(word.startTime/1000,[wordXPosition,wordYPosition]);
                        word.afterEffectsTextLayer.property("Position").setValueAtTime(word.endTime/1000 ,[wordXPosition,wordYPosition]); 
                        word.afterEffectsTextLayer.property("Scale").setValueAtTime(word.startTime/1000,[100*scalingXAmount,100*scalingYAmount]);
                        word.afterEffectsTextLayer.property("Scale").setValueAtTime(word.endTime/1000 ,[100 * scalingXAmount, 100*scalingYAmount]); 
                },

            setFont:function(textLayer)
            {
                        textProperty = textLayer.property("Source Text");
                        textPropertyValue = textProperty.value;
                        textPropertyValue.resetCharStyle();
                        textPropertyValue.fontSize = 100;
                        textPropertyValue.fillColor = [1, 1, 1];
                        textPropertyValue.strokeColor = lyricRecorderLineStyleUtilities.hexToColor("000000");
                        textPropertyValue.strokeWidth =1;
                        textPropertyValue.fillOverStroke = true;
                        textPropertyValue.applyStroke = true;                        
                        textPropertyValue.font = "Franklin Gothic Heavy";
                        textProperty.setValue(textPropertyValue);          
            },
        
         setFont1:function(textLayer)
            {
                        textProperty =  textLayer.property("Source Text");
                        textPropertyValue = textProperty.value;
                        textPropertyValue.resetCharStyle();
                        textPropertyValue.fontSize = 100;
                        textPropertyValue.fillColor = lyricRecorderLineStyleUtilities.hexToColor("1FD930");
                        textPropertyValue.strokeColor = lyricRecorderLineStyleUtilities.hexToColor("000000");
                        textPropertyValue.strokeWidth =1;
                        textPropertyValue.fillOverStroke = true;
                        textPropertyValue.applyStroke = true;     
                        textPropertyValue.font = "Franklin Gothic Heavy";
                        textProperty.setValue(textPropertyValue);     
            },
            printPropertiesOfLayer: function (propGroup, propPath)
            {
              

            
                
                
                  $.writeln ("***");
                  //  $.writeln( "scanPropGroupProperties:" + propGroup.name );    
                    var i, prop;

                    // Iterate over the specified property group's properties
                    for (i=1; i<=propGroup.numProperties; i++)
                    {
                        prop = propGroup.property(i);
                      
                        if (prop.propertyType === PropertyType.PROPERTY)    // Found a property
                        {
                            $.writeln( "Prop:" + propPath + "." + prop.name);
                             lyricRecorderLineStyleUtilities.logMe("Prop:" + propPath);
                            // Found a property
                            // FYI: layer markers have a prop.matchName = "ADBE Marker"
                        }
                        else if ((prop.propertyType === PropertyType.INDEXED_GROUP) || (prop.propertyType === PropertyType.NAMED_GROUP))
                        {
                            // Found an indexed or named group, so check its nested properties
                                propPath+="."+prop.name;
                               $.writeln("Prop Group:" + propPath);
                               lyricRecorderLineStyleUtilities.logMe("Prop Group:" + propPath);
                               lyricRecorderLineStyleUtilities.printPropertiesOfLayer(prop, propPath);
                        }
                    }
            },
            logMe: function(input)
            {
                var now = new Date();
                var output = now.toTimeString() + ": " + input;
                $.writeln(output);
                var logFile = File("H:\\Development\\afterEffects\\logFile1.txt");
                logFile.open("a");
                logFile.writeln(output);
            logFile.close();
            },
        
 hexToColor:function(theHex){

 

 

  theHex = parseInt(theHex,16);

 

  var r = theHex >> 16;

  var g = (theHex & 0x00ff00) >> 8;

  var b = theHex & 0xff;

 

  return [r/255,g/255,b/255];

 

}        
        
        }
  
}


