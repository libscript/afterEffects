﻿{
    #include "json2.js" // jshint ignore:line    
    #include "lyricRecorderLineStyle1.jsx" // jshint ignore:line    
    #include "lyricRecorderLineStyle2.jsx" // jshint ignore:line   
    #include "lyricRecorderLineStyleUtilities.jsx" // jshint ignore:line  
    //   #include ".\\rd_scripts\\rd_GimmeProps.jsx"
    //#include ".\\rd_scripts\\rd_GimmePropPath.jsx"
   #include ".\\rd_scripts\\rd_GimmePropInfo.jsx"
    //  #include ".\\rd_scripts\\rd_KeyMarkers.jsx"
    
 //     #include ".\\rd_scripts\\rd_ShapesToMasks.jsx"

    //#include ".\\rd_scripts\\rd_ExprTweaker.jsx"


    var AUDIO_LOCATION = "H:\\Development\\2018\\AfterEffects\\afterEffects\\afterEffectsProject\\resources\\LyricRecorder\\audio\\audio.mp3";
    var LYRIC_LOCATION = "H:\\Development\\2018\\AfterEffects\\afterEffects\\afterEffectsProject\\resources\\LyricRecorder\\lyricData\\LyricRecorder.js";

    var COMP_NAME = "MusicVideo";
    var COMP_WIDTH = 1920;
    var COMP_HEIGHT = 1080;
    var COMP_PIXEL_ASPECT = 1;
    var COMP_DURATION = 15; //Test Value
    var COMP_FRAME_RATE = 30;

    app.beginUndoGroup( "Create Music Video" );

    var lyricRecorderAE = {

        createComposition: function( audioFileLocation, lyricsFileLocation ) {
            var lyricJsonObject = lyricRecorderAE.readLyricDataFromFile( lyricsFileLocation );
            var lines = lyricJsonObject.lyricRecorderSynchronisedLyrics;

            // Creating a Project
            var currentProject = app.newProject();

            var mp3File = currentProject.importFile( new ImportOptions( File( audioFileLocation ) ) );

            // Creating comp

            //var compDuration=mp3File.duration;
            var compDuration = COMP_DURATION;
            var currentComp = currentProject.items.addComp( COMP_NAME, COMP_WIDTH, COMP_HEIGHT, COMP_PIXEL_ASPECT, compDuration, COMP_FRAME_RATE );
            currentComp.openInViewer();
            currentComp.layers.add( mp3File );

            var camera = currentComp.layers.addCamera( "alexCamera1", [currentComp.width / 2, currentComp.height / 2] );
            var light = currentComp.layers.addLight( "alexLight1", [currentComp.width / 2, currentComp.height / 2] );
            light.castsShadows.setValue( 1 );

            //Add a background
            var backgroundLayer = currentComp.layers.addSolid(lyricRecorderLineStyleUtilities.hexToColor("2BBAE3"), "Background", COMP_WIDTH * 5, COMP_HEIGHT * 5, COMP_PIXEL_ASPECT );
            backgroundLayer.threeDLayer = true;
            lyricRecorderAE.handleLines( lines, currentComp, camera, light );
            app.executeCommand( app.findMenuCommandId( "Convert Audio to Keyframes" ) );
        },

        readLyricDataFromFile: function( lyricsFile ) {
            var scriptFile = File( lyricsFile );
            scriptFile.open( 'r' );
            var content = scriptFile.read();
            my_JSON_object = JSON.parse( content );// now evaluate the string from the file
            scriptFile.close();
            return my_JSON_object;
        },

        handleLines: function( lines, currentComp, camera, light ) {
            // for(var i=0; i<lines.length; i++)
            for ( var i = 0; i < 3; i++ ) {
                var line;
                line = lines[i];
                lyricRecorderLineStyle2.drawLine( currentComp, line, i, camera, light );
                
                //set the timings for Animator 1
                for ( var j = 0; j < line.words.length; j++ ) {
                    word = line.words[j];
                    var animationStart = word.afterEffectsTextLayer.property( "Text" ).property( "Animators" ).property( "Animator 1" ).property( "Selectors" ).property( "Range Selector 1" ).property( "Start" );
                    for ( var k = animationStart.numKeys; k > 0; k-- ) {
                        animationStart.removeKey( k );
                    }

                    word.afterEffectsTextLayer.startTime = line.startTime / 1000;
                    word.afterEffectsTextLayer.outPoint = line.endTime / 1000;
                    
                      word.afterEffectsTextLayer1.startTime = line.startTime / 1000;
                    word.afterEffectsTextLayer1.outPoint = line.endTime / 1000;
                    
                    animationStart.setValueAtTime(( line.startTime / 1000 ), 50 );
                    animationStart.setValueAtTime(( word.startTime / 1000 ), 50);
                    animationStart.setValueAtTime(( word.endTime / 1000 ), 100 );
                    
                    
                    
                        var  textProperty =  word.afterEffectsTextLayer1.property("Source Text");
                        var textPropertyValue = textProperty.value;
                        textPropertyValue.resetCharStyle();
                        textPropertyValue.fontSize = 200;
                        textPropertyValue.fillColor = lyricRecorderLineStyleUtilities.hexToColor("1FD930");
                        textPropertyValue.font = "SavingsBond";
                        textProperty.setValue(textPropertyValue);          
                    
                    
                       var newMask =  word.afterEffectsTextLayer1.Masks.addProperty("Mask");
                    //newMask.inverted = true;
                    var myMaskShape = newMask.property("maskShape");
                    var myShape = myMaskShape.value;
                   myShape.vertices = [[0,0],[0,0-word.wordHeight],[0+word.wordWidth,0-word.wordHeight],[0+word.wordWidth,0]];
                  
                  var myShape1 = myMaskShape.value;
                   myShape1.vertices = [[0,0],[0,0-word.wordHeight],[0,0-word.wordHeight],[0,0]];
                  
                    myShape.closed = true;
                  //  myMaskShape.setValue(myShape);               
                  myMaskShape.setValueAtTime( word.startTime/1000, myShape1);      
                    myMaskShape.setValueAtTime( word.endTime / 1000, myShape);        
                  
  $.writeln( word.word+ " "+ word.startTime );                  
                    
                    
                }

                // precompose the comp in to lines
                var indexesToPrecompose = [];
                for ( var m = currentComp.layers.length - ( i + 4 ); m > 0; m-- ) {
                    indexesToPrecompose.push( m );
                }
                var lineComp = currentComp.layers.precompose( indexesToPrecompose, "Line_" + i, true );
                lineComp.threeDLayer = true;
                //   lineComp.openInViewer();
            }
            
            // Make all layers 3d
            for ( var i = 1; i < currentComp.layers.length; i++ ) {
                currentComp.layers[i].threeDLayer = true;
                $.writeln( "Comp Layers Name: " + currentComp.layers[i].threeDLayer );
            }
        


        }


    }

    lyricRecorderAE.createComposition( AUDIO_LOCATION, LYRIC_LOCATION );
    app.endUndoGroup();
}

