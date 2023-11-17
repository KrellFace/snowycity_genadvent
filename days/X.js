// Made by Ollie Withington (keep this line and replace with your name)

//Layers
let layerMainGraphics = null
let layerSnowGlobe = null
let layerUI = null
let layerGlobeHighlight = null

//Terrain Variables

let terrainHeight = 0

//Buildings Variables
let minBuildingX = 0

let minBuildHeight = 0
let maxBuildHeight = 0
let minBuildWidth = 0
let maxBuildWidth = 0
let minBuildGap = 0
let maxBuildGap = 0

let widthPortionBuildings = 0
let buildingData = []

let buildingDrawRate = 2
let buildingDrawIncrementer = 0
let buildingCounter = 0
let allBuildingsDrawn = null

let doorHeight = 0
let doorWidth = 0

let bWindowHeight = 0
let bWindowWidth = 0
let bWindowGap = 0

//Terrain
let bgCol = null
let hill1Col = null
let hill2Col = null
let hill3Col = null
let h1Height = 0
let h2Height = 0
let h3Height = 0
let h1Seed = 0
let h2Seed = 0
let h3Seed = 0
let terrainCol = null
let darkerTerrain=null
let darkestTerrain=null
let buildingAnchorCol = []

//Amount of space either side occupied by snow globe
const globeEdgeTrim=130

//Sun Logic
let sunColor = []
let sunSize = 0 
let sunLocation = [] 

const sunRayLoopTime = 100
let sunLoopTimer = 0

let sunRayWidth = 0
let sunRayLength = 0
let sunRayMinLength = 0
let sunRayMaxLength = 0
const sunSpinRate = 0.3

let sunRayAngles = [0,45,90,135,180,225,270,315,360]

//Snow Logic
let snowLocations = []
const snowDensity = 0.4
const snowDensityModifier = 0.05
const snowFallingRate = 5
const snowNoiseScale = 0.25
const snowSwirlAmount = 10
const swirlScale = 0.05
const swirlChaosMod = 20

let currWind = 0;
const maxWind = 20;
let windMod = 0.5
let blowingLeft = false;
let blowingRight = false;

//Snow Piles Logic

let snowPilePositions=[]
let accumulatingSnow= false
const snowPileNoiseScale = 0.08

let prevDrawnBuilding=[]

//Trees
let minTreeX = 0
let minTreeHeight = 0
let maxTreeHeight = 0
let minBranches = 0
let maxBranches = 0
let minYOffSetRatio = 0
let maxYOffSetRatio = 0
let minTreeGap = 0
let maxTreeGap = 0
let widthPortionTree = 0

let treeData = []

let treeBranchColor = null 
let treeLeafColor = null

//Shake
let shaking = false
let shakeMaxXlim=30
let shakeXlim=10
let shakeCurrOffset = 0
let shakeTimeLoop = 5
let shakeLoopTimer = 0
let shakeTotalTime = 100
let shakeTotalTimer = 0
let shakeMaxSnowUpSpeed = 10
let shakeUpSnowSpeedMod=0
let shakeMaxSnowSideSpeed = 40
let shakeCurrMaxSnowSideSpeed = 0
let shakeSnowSideSpeedMod = 0

// Seed storage

let mainSeed = null;
let userSeed = "";

function dayXPreload() {

    // Load any assets here (with assets.dayX at the front of the variable name)
}



class DayX extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = " Press Spacebar to generate a new town, control the wind with the Left and Right arrow key, and press Enter to shake the globe. You can also manually enter a town ID before pressing space to generate a specific globe. Don't forget to make a note of ones you like!"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Ollie Withington"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
        layerMainGraphics = createGraphics(700, 700)
        layerSnowGlobe = createGraphics(700, 700) 
        layerUI = createGraphics(700, 700) 
        layerGlobeHighlight =createGraphics(700, 700);
    }

    prerun() {
        initialise()
        
    }

    update() {

      //console.log("User seed:" + userSeed)
      console.log("Total snow locations: " + snowLocations.length)

      // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
      //if(allBuildingsDrawn!=true){
      if(false){

        buildingDrawIncrementer+=1
        if(buildingDrawIncrementer>buildingDrawRate){
        
          drawBuilding(buildingData[buildingCounter])
          buildingCounter+=1
          buildingDrawIncrementer = 0
          
          if(buildingCounter>buildingData.length-1){
            //console.log("All buildings drawn")
            allBuildingsDrawn=true
          }
        }
      }
      //Snow drawing
      else{
      
        layerMainGraphics.background(bgCol);
        drawSun(sunColor,sunSize,sunLocation)
        drawSunRays()
        drawHill(h1Height, color(hill1Col), h1Seed)
        drawHill(h2Height, color(hill2Col), h2Seed)
        drawHill(h3Height, color(hill3Col), h3Seed)
    
        //Terrain Gen
        drawTerrainBase(terrainHeight, terrainCol, darkerTerrain, darkestTerrain)
    
        drawAllBuildings()
        //console.log(treeData.length)
        
        treeData.forEach(drawTree)
        layerMainGraphics.strokeWeight(1)
    
        //Generating new snow
        initialiseSnowLocations()

        //Update snow wind
        if(blowingRight&&currWind<maxWind){
          currWind+=1
        }
        else if(blowingLeft&&currWind>-maxWind){
          currWind-=1
        }
        else if(currWind<0){
          currWind+=1
        }
        else if(currWind>0){
          currWind-=1
        }

        //Falling snow
        for(i=0;i<snowLocations.length;i++){
          //console.log(snowLocations[i])
          snowLocations[i][1]+=(snowFallingRate-shakeUpSnowSpeedMod)
          var chaos = random(-swirlChaosMod,swirlChaosMod)
          var swirl = (noise(((snowLocations[i][0]+chaos)*swirlScale),((snowLocations[i][1]+chaos)*swirlScale),(frameCount*swirlScale))*snowSwirlAmount)-(snowSwirlAmount/2)
  
          snowLocations[i][0]+=((swirl*max(shakeSnowSideSpeedMod,1))+(currWind*windMod))
          layerMainGraphics.fill(255,255,255)
          layerMainGraphics.noStroke()
          //stroke(255)
          layerMainGraphics.circle(snowLocations[i][0], snowLocations[i][1], random(1,5));
          var belowTerrain = snowLocations[i][1]>(height-terrainHeight-3)
          var aboveGlobe = snowLocations[i][1]<(0)
          if(belowTerrain||aboveGlobe){
            //snowLocations.shift()
            snowLocations.splice(i, 1)
            if(!accumulatingSnow&&belowTerrain){
                accumulatingSnow=true
            }
          }
        }

      }
        
      if(accumulatingSnow){
        for(var i=0;i<snowPilePositions.length;i++){
            
          var snowChange = noise(frameCount*snowPileNoiseScale*0.1, snowPilePositions[i][0]*snowPileNoiseScale, snowPilePositions[i][1]*snowPileNoiseScale)
          //console.log(snowChange)
          snowChange-=.48
          var absChange = abs(snowChange)
          //console.log(snowChange)
          var currDepth = snowPilePositions[i][2]
          var maxDepth = snowPilePositions[i][3]
          var leftDepth = 0
          if(i!=0){
            leftDepth = abs(currDepth,snowPilePositions[i-1][2])
          }
          var rightDepth = 0
          if(i<snowPilePositions.length-1){
            rightDepth = abs(currDepth,snowPilePositions[i+1][2])
          }
          //if(absChange/2>random(0,1)&&leftDepth<3&&rightDepth<3){
          if(absChange/2>random(0,1)){   
          //Decrease depth
            if(snowChange<0){
                //console.log("Decrease depth")
                snowPilePositions[i][2] = max(currDepth-1, 0)
            }
            else{
                snowPilePositions[i][2] = min(currDepth+1, maxDepth)
            }
          }
          
          //Draw snow
          layerMainGraphics.stroke([255,255,255])
          layerMainGraphics.line(snowPilePositions[i][0],height-snowPilePositions[i][1],snowPilePositions[i][0],height-snowPilePositions[i][1]-snowPilePositions[i][2])
        }  
      }

      //Draw trees last so they are in front of snowy windows
      treeData.forEach(drawTree)
      layerMainGraphics.strokeWeight(1)  
      

      //Snow globe main rim
      layerSnowGlobe.background(30)
      layerSnowGlobe.stroke([217,242,255])
      //layerSnowGlobe.noFill()
      layerSnowGlobe.strokeWeight(11)
      layerSnowGlobe.circle(width/2,height/2,655)

      //Snow globe sunlit rim
      layerSnowGlobe.stroke(sunColor)
      layerSnowGlobe.strokeWeight(3)
      layerSnowGlobe.circle(width/2,height/2,655)

      layerSnowGlobe.strokeWeight(1)
        
      //Snow globe cut out
      
      
      layerSnowGlobe.erase()
      layerSnowGlobe.noStroke()
      layerSnowGlobe.circle(width/2,height/2,653)
      layerSnowGlobe.noErase()
      


      //Globe light highlight
      
      /*
      layerGlobeHighlight = createGraphics(700, 700)  
      
      layerGlobeHighlight.fill([255,255,255,20])
      layerGlobeHighlight.noStroke()
      layerGlobeHighlight.circle((width/2)+20,(height/2)-20,550)

      layerGlobeHighlight.erase()
      layerGlobeHighlight.noStroke()
      layerGlobeHighlight.circle((width/2)+20,(height/2)-20,500)
      layerGlobeHighlight.noErase()
      */
      
      //Draw wood base
      layerSnowGlobe.fill([156,96,44]) 
      layerSnowGlobe.stroke([122,77,37])
      layerSnowGlobe.rect(160,630,380,70)

      layerSnowGlobe.fill([76,47,18])
      layerSnowGlobe.stroke([54,32,12])
      layerSnowGlobe.rect(120,650,460,50)

      //Draw Gold Plaque

      layerSnowGlobe.fill([99, 76, 37])
      layerSnowGlobe.noStroke()
      layerSnowGlobe.strokeWeight(1)
      layerSnowGlobe.rect(147,657,406,36)
      
      layerSnowGlobe.fill([156, 112, 37])
      layerSnowGlobe.stroke([82, 59, 20])
      layerSnowGlobe.strokeWeight(1)
      layerSnowGlobe.rect(150,660,400,30)

      

      //Draw Globe Text
      
      layerSnowGlobe.fill([43, 34, 18])
      layerSnowGlobe.noStroke()
      layerSnowGlobe.textSize(24);
      layerSnowGlobe.text('Town #' + mainSeed, 290, 682);

      //Draw Curr User input


      //layerUI = createGraphics(700, 700) 
      layerUI.fill(80)
      layerUI.rect(7,14,155,40)
      layerUI.fill(220)
      //layerUI.noStroke()
      layerUI.textSize(24);223
      layerUI.text('Seed: ' + userSeed, 10, 40);
      
      


      //layerMainGraphics.background=([0,0,0])
      //layerMainGraphics.erase()
      //layerMainGraphics.circle(width/2,height/2,700)

      //image(layerMainGraphics,700, 700)
      if(shaking){
        shake()

      }
      //console.log(shakeCurrOffset)
     
      image(layerMainGraphics,shakeCurrOffset,0)
      image(layerSnowGlobe,shakeCurrOffset,0)
      image(layerGlobeHighlight,shakeCurrOffset,0)
      image(layerUI,0,0)
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {

    }

    mouseReleased() {

    }

    keyPressed() {
      if(keyCode==32){
        initialise()
      }
      else if(keyCode == RIGHT_ARROW){
        blowingRight = true
      }
      else if(keyCode == LEFT_ARROW){
        blowingLeft = true
      }
      else if(keyCode == LEFT_ARROW){
        blowingLeft = true
      }
      //Numeric
      else if(keyCode==13){
        shaking=true
      }
      else if(keyCode==49){
        console.log("1 pressed")
        addToUserSeedInput("1")
      }
      else if(keyCode==50){
        console.log("2 pressed")
        addToUserSeedInput("2")
      }
      else if(keyCode==51){
        console.log("3 pressed")
        addToUserSeedInput("3")
      }
      else if(keyCode==52){
        console.log("4 pressed")
        addToUserSeedInput("4")
      }
      else if(keyCode==53){
        console.log("5 pressed")
        addToUserSeedInput("5")
      }
      else if(keyCode==54){
        console.log("6 pressed")
        addToUserSeedInput("6")
      }
      else if(keyCode==55){
        console.log("7 pressed")
        addToUserSeedInput("7")
      }
      else if(keyCode==56){
        console.log("8 pressed")
        addToUserSeedInput("8")
      }
      else if(keyCode==57){1
        console.log("9 pressed")
        addToUserSeedInput("9")
      }

    }

    keyReleased() {
      if(keyCode == RIGHT_ARROW){
        blowingRight = false
      }
      else if(keyCode == LEFT_ARROW){
        blowingLeft = false
      }
    }

    // Below is the basic setup for a nested class. This can be deleted or renamed

    HelperClass = class {

        constructor() {

        }
    }
}

function initialise(){
  
    //Remove all data in case we are regenerating a new city

    buildingData=[]
    treeData=[]
    snowLocations=[]
    snowPilePositions=[]
    accumulatingSnow=false  

    if(userSeed!=null&&!isNaN(int(userSeed))){
        mainSeed = int(userSeed)
        
    }
    else{
        mainSeed = int(random(0,10000))
        console.log(mainSeed) 
    }  
    userSeed=""

    //Generate Seed
    noiseSeed(mainSeed)
    randomSeed(mainSeed)
  
    generateColors()            

    layerMainGraphics.background(bgCol);

    generateSunCharacteristics(bgCol)
    drawSun(sunColor,sunSize,sunLocation)

    h1Seed = random(0,1000)
    h2Seed = h1Seed+500
    h3Seed = h2Seed+1000

    generateAllHills()

    //Terrain Gen
    terrainHeight = random(130, 130)
    drawTerrainBase(terrainHeight, terrainCol, darkerTerrain, darkestTerrain)

    for(z=0;z<width;z++){
        append(snowPilePositions,[z,terrainHeight,0,100])
    }

    //Generating Building Design parameters and locations
    generateBuildingParameters()
    generateBuildingData()
    //Generating Tree Design parameters and locations
    generateTreeParameters()
    generateTreeData()

    buildingData.reverse().forEach(generateSnowPileDataForBuilding)
    buildingData.reverse()
    //Initialise snow
    initialiseSnowLocations()
    }

/*
function inputSeed(){
    console.log('you are typing: ', this.value());
    userSeed=this.value()
  }
  */
  function drawBuilding(bd){
  
    //Generate base building
    var bOutlineCol = [bd[3][0]-10, bd[3][1]-10,bd[3][2]-10]
    
    layerMainGraphics.stroke(bOutlineCol)
    layerMainGraphics.fill(bd[3])
    
    var buildYloc = height-terrainHeight-bd[2]-1
    
    layerMainGraphics.rect(bd[0], buildYloc, bd[1], bd[2])
    
    //Generating DoorWay
    layerMainGraphics.fill(color(bd[3][0]-50,bd[3][1]-50,bd[3][2]-50))
         
    layerMainGraphics.rect(bd[0]+(bd[1]/2)-(doorWidth/2), height-terrainHeight-doorHeight-1, doorWidth, doorHeight)
    
  
    var wData = calcWindowData(bd[1],bd[2])
    var horiWindowCount = wData[0]
    var vertWindowCount = wData[1]
    var horiSideGap = wData[2]
    
    
    for (x=0;x<horiWindowCount;x++){
      for (y=0;y<vertWindowCount;y++){
          
        var xloc = bd[0]+horiSideGap+(x*(bWindowWidth+bWindowGap))
        var yloc = buildYloc+bWindowGap+(y*(bWindowWidth+bWindowGap))
        layerMainGraphics.fill(color(bd[3][0]-50,bd[3][1]-50,bd[3][2]-50))
        layerMainGraphics.rect(xloc, yloc, bWindowWidth, bWindowWidth)
        
        
      }
    }
    
    return buildingWidth
  }
  
  function calcWindowData(houseWidth, houseHeight){
    var horiWindowCount = floor((houseWidth-bWindowGap)/(bWindowWidth+bWindowGap))
    var vertWindowCount = floor((houseHeight-doorHeight-bWindowGap)/(bWindowWidth+bWindowGap))
    
    var horiSideGap = (houseWidth-(horiWindowCount*(bWindowWidth+bWindowGap))+bWindowGap)/2
    
    return [horiWindowCount,vertWindowCount,horiSideGap]
  }
  
  function drawAllBuildings(){
    for(i=0;i<buildingData.length;i++){
      drawBuilding(buildingData[i])
    }
  }
  
  function drawTerrainBase(h, c1,c2,c3){
    layerMainGraphics.noStroke()
    layerMainGraphics.fill(c1)
    layerMainGraphics.rect(0, height-h, width, h)
    layerMainGraphics.noStroke()
    layerMainGraphics.fill(c2)
    layerMainGraphics.rect(0, height-(h*.9), width, h)
    layerMainGraphics.noStroke()
    layerMainGraphics.fill(c3)
    layerMainGraphics.rect(0, height-(h*.8), width, h) 
  }
  
  function generateColors(){  
    //Color Gen
    bgCols = [random(200, 255),random(200, 255),random(200, 255)]
    bgCol = color(bgCols)
  
    h1Height = random((height*(2/3)), (height))
    
    //h1Height = random(700, 1000)
    h1Cols = generateProximalColor(bgCols,30, 50, true) 
    hill1Col = color(append(h1Cols,1000))
    
    h2Height = random((h1Height-((height-h1Height)*(1/50)), (h1Height-((height-h1Height)*(1/40)))))
    //h2Height = random(h1Height-5, h1Height-10)  
    h2Cols = generateProximalColor(h1Cols,30, 50, true)
    hill2Col = color(append(h2Cols,1000))
    
    h3Height = random((h2Height-((height-h2Height)*(1/50)), ((height-h2Height)-(height*(1/40)))))
    h3Cols = generateProximalColor(h2Cols,30, 50, true)
    hill3Col = color(append(h3Cols,1000))
     
    buildingAnchorCol = generateProximalColor(h3Cols, 100, 60)
    
    terrainCol = generateProximalColor(h3Cols,30, 50, true)
    darkerTerrain=generateProximalColor(terrainCol,50,40, true)
    darkestTerrain=generateProximalColor(darkerTerrain,50,40, true)
    
    
    treeLeafColor = generateProximalColor(buildingAnchorCol,80, 120)
    treeBranchColor = generateProximalColor(treeLeafColor,120, 120)
    append(treeLeafColor,200)
  }
  
  function generateBuildingParameters(){
    minBuildHeight = random((height*(1/20)), (height*(1/10)))
    maxBuildHeight = random(minBuildHeight+(height*(1/20)), minBuildHeight+(height*(1/3)))
    minBuildWidth = random((width*(1/50)), (width*(1/35)))
    maxBuildWidth = random(minBuildWidth+(width*(1/50)), minBuildWidth+(width*(1/25)))
    minBuildGap = random(-(width*(1/60)), (width*(1/40)))
    maxBuildGap = random(max(minBuildGap+(width*(1/40)), 0), max(minBuildGap+(width*(1/25)), 10))
    
    widthPortionBuildings = random(0.15, 0.2)
    
    doorWidth = minBuildWidth/3
    doorHeight = min((doorWidth*3),minBuildHeight/2)
    
    bWindowHeight = doorWidth
    bWindowWidth = doorWidth
    bWindowGap = doorWidth/2
    
  }
  
  function generateTreeParameters(){
    
    maxTreeHeight = random(30,79)
    minTreeHeight = random(maxTreeHeight*.5,maxTreeHeight*.7)
    minBranches = int(random(4,8))
    maxBranches = int(random(minBranches,minBranches+6))
    minYOffSetRatio = random(-0.4,0.4)
    maxYOffSetRatio = random(minYOffSetRatio-.1, minYOffSetRatio+.1)
    minTreeGap = random(-(width*(1/60)), (width*(1/40)))
    maxTreeGap = random(max(minTreeGap+(width*(1/40)), 0), max(minTreeGap+(width*(1/25)), 10))
    widthPortionTree = random(0.12, 0.17)
  }
  
  function generateAllHills(){ 
    
    drawHill(h1Height, color(hill1Col), h1Seed)
    drawHill(h2Height, color(hill2Col), h2Seed)
    drawHill(h3Height, color(hill3Col), h3Seed)
  }
   
  function generateBuildingData(){
    for (i=globeEdgeTrim; i<width-globeEdgeTrim; i++){
      val = noise(i)
      genBuilding = false
      if(val<widthPortionBuildings){
        //Clunky handling for only checking the gap if there is already a building added
        if(buildingData.length>0){
          if(i>buildingData[buildingData.length-1][0]+(width*(1/50))){
            genBuilding = true
            //append(buildingData, [i])
          }
        }
        else{
          //append(buildingData, [i])
          genBuilding = true
        }
      }
      if(genBuilding){
        //HACK - I reverts to value of 2 after appending to dict
        generationLoc = i
        buildingWidth = random(minBuildWidth, maxBuildWidth)
        buildingHeight = random(minBuildHeight, maxBuildHeight)
        bd=[i,buildingWidth,buildingHeight,generateProximalColor(buildingAnchorCol,0,30)]
        append(buildingData,bd)
        
        
      }
    }
    
    //console.log("All building data generated")
  }
  
  function generateTreeData(){
    
    for (var i=globeEdgeTrim; i<width-globeEdgeTrim; i++){
      //console.log("i:")
      //console.log(i)
      
      var val = noise(i+1000)   
      var genTree= false
      if(val<widthPortionTree){
        //Clunky handling for only checking the gap if there is already a building added
        if(treeData.length>0){
          if(i>treeData[treeData.length-1][0][0][0]+(width*(1/100))){
            genTree = true
            //append(buildingData, [i])
          }
        }
        else{
          //append(buildingData, [i])
          genTree = true
        }
      }
      if(genTree){
        //HACK - I reverts to value of 2 after appending to dict
        var generationLoc = i
        var branches = []
        var leaves = []
        var treeHeight = random(minTreeHeight,maxTreeHeight)
        var branchCount = int(random(minBranches, maxBranches))
        var treeBaseYLoc = height-terrainHeight
        var treeTopYLoc = height-terrainHeight-treeHeight

        var branchYOffsetRatio = random(minYOffSetRatio, maxYOffSetRatio)
        //Main stem
        append(branches,[i, treeBaseYLoc,i, treeTopYLoc,5])
        /*
        //Big Leaf
        append(leaves,[i, height-terrainHeight-(treeHeight*.7),treeHeight*.55])
        //Med Leaf
        append(leaves,[i, height-terrainHeight-(treeHeight*.85),treeHeight*.35])
        //Small Leaf
        append(leaves,[i, height-terrainHeight-(treeHeight*.95),treeHeight*.2])
        */
        //End leaf
        append(leaves,[i, height-terrainHeight-(treeHeight*.95),treeHeight*.4])
        placePilesOnLeaf(i,height-terrainHeight-(treeHeight*.95),  (treeHeight*.4)/2, true)
        //snowPilePositions = concat(snowPilePositions, endPoints)

        //Sub branches
        var branchMinRoot = treeBaseYLoc-(treeHeight*.2)
        var maxBranchXLength = (treeHeight*.5)
        var prevBranchLeft = false
        for(q=0;q<branchCount;q++){
          var gapToTop = treeTopYLoc-branchMinRoot
          var root = random(branchMinRoot,branchMinRoot+(gapToTop/2))
          var branchXLength = random(maxBranchXLength/2, maxBranchXLength)
          var branchY = abs(branchXLength)*branchYOffsetRatio
          if(!prevBranchLeft){
            branchXLength=-branchXLength
          }
          prevBranchLeft=!prevBranchLeft    
          
          
          append(branches,[i, root,i+branchXLength, root+branchY ,3])
          /*
          //Big Leaf
          append(leaves,[i+(branchXLength*.4), root+(branchY*.4),branchXLength*.8])
          //Med Leaf
          append(leaves,[i+(branchXLength*.65), root+(branchY*.65),branchXLength*.5])
          //Small Leaf
          append(leaves,[i+(branchXLength*.95), root+(branchY*.95),branchXLength*.3])
          */
          //End leaf
          append(leaves,[i+(branchXLength*.95), root+(branchY*.95),branchXLength*.6])
          var cachedLength = branchXLength
          //console.log("Cached length: " + cachedLength)
          placePilesOnLeaf(i+(cachedLength*.95),root+(branchY*.95), abs((cachedLength*.6)/2), true)
          maxBranchXLength=abs(branchXLength)
          branchMinRoot=root
        }

        var td = [branches,leaves]
        append(treeData,td)
        
        
      }
    }
    
    //console.log("All building data generated")
  }
  
  function drawTree(td){ 
    
    //Draw branches
    for(i = 0; i<td[0].length;i++){
      layerMainGraphics.stroke(treeBranchColor)
      layerMainGraphics.strokeWeight(td[0][i][4])
      layerMainGraphics.line(td[0][i][0],td[0][i][1],td[0][i][2],td[0][i][3])
    }
    //Draw Leaves
    for(j = 0; j<td[1].length;j++){
      layerMainGraphics.noStroke()
      layerMainGraphics.fill(treeLeafColor)
      layerMainGraphics.circle(td[1][j][0],td[1][j][1],td[1][j][2])
    }  
  }
  
  function generateSnowPileDataForBuilding(bd){
    //Updating snow height map
    var bx1 = bd[0]
    var bWidth = bd[1]
    var bHeight = bd[2]
    
    var by1=(bHeight+terrainHeight)
    var bx2=bx1+bWidth
    var by2=terrainHeight
    
    //Roof snow piles
    
    for(k=bx1;k<(bx1+bWidth);k++){ 
      
      if(!(k>prevDrawnBuilding[0]&&k<prevDrawnBuilding[2]&&by1<prevDrawnBuilding[1]&&by1>prevDrawnBuilding[3])){
        
        append(snowPilePositions,[k,by1,0,5])
      }
    }
  
    var wData = calcWindowData(bd[1],bd[2])
    var horiWindowCount = wData[0]
    var vertWindowCount = wData[1]
    var horiSideGap = wData[2]
  
  
    for (x=0;x<horiWindowCount;x++){
      for (y=0;y<vertWindowCount;y++){
        for(w=0;w<bWindowWidth;w++){
          
          var xLoc=bx1+horiSideGap+(x*(bWindowWidth+bWindowGap))+w
          var yLoc = by1-bWindowGap-(y*(bWindowWidth+bWindowGap))-bWindowWidth
          if(!(xLoc>prevDrawnBuilding[0]&&xLoc<prevDrawnBuilding[2]&&yLoc<prevDrawnBuilding[1]&&yLoc>prevDrawnBuilding[3])){
            append(snowPilePositions,[xLoc,yLoc,0, 4])
          }
          
        }
      }
  
    }
    
    prevDrawnBuilding = [bx1,by1,bx2,by2]
  }
  
  function generateProximalColor(col, minDist, maxDistPerVal, darkerOnly = false, lighterOnly = false){
    //console.log("Generating proximal color")
    var generated = false
    var returnVal = []
    var loopBreak = 0
    while  (!generated){
      if(darkerOnly){
      returnVal = [random(max((col[0]-maxDistPerVal),0),col[0]),
        random(max((col[1]-maxDistPerVal),0),col[1]),
        random(max((col[2]-maxDistPerVal),0),col[2])]
      }
      else if(lighterOnly){
        
      returnVal = [random(max(col[0],min((col[0]+maxDistPerVal),255)),
        random(col[1],min((col[1]+maxDistPerVal),255)),
        random(col[2],min((col[2]+maxDistPerVal),255)))]
      }
      else{
      returnVal = [random(max((col[0]-maxDistPerVal),0),min((col[0]+maxDistPerVal),255)),
        random(max((col[1]-maxDistPerVal),0),min((col[1]+maxDistPerVal),255)),
        random(max((col[2]-maxDistPerVal),0), min((col[2]+maxDistPerVal),255))]
      }
      
      var s= 0
      for(i = 0; i<2;i++){
        s+=abs(returnVal[i]-col[i])
      }
      if(s>minDist){
        generated = true
      }
      loopBreak+=1
      if(loopBreak>10){
        generated = true
        
      }
      
    }
    
    return returnVal
  }
  
  function drawHill(h, col, seed){
  
    var noiseScale = 0.006;
    for (let x = 0; x < width; x += 1) {
      // Scale input coordinates.
      var nx = noiseScale * x;
      var nt = noiseScale * seed;
      // Compute noise value.
      var y = h * noise(nx, nt);
      // Render.
      layerMainGraphics.stroke(col)
      layerMainGraphics.line(x, height, x, height-y);
    }
  }
  
  function initialiseSnowLocations(){
    //console.log("Generating snow locations ")
    var newLocs = []
    var sideLocs = []
    var allAdditions=[]
    for (i=0; i<width;i++){
      if((noise((i*snowNoiseScale),(frameCount*snowNoiseScale))<snowDensity)&&(random(0,1)<snowDensityModifier)){
        append(newLocs, [i,0])
      }
    }
    if(currWind>0||shaking){
      for (y=0; y<height-terrainHeight;y++){
        if((noise((y*snowNoiseScale),(frameCount*snowNoiseScale))<snowDensity)&&(random(0,1)<snowDensityModifier)){
          append(sideLocs, [0,y])
        }
      }
      //snowLocations = concat(snowLocations, sideLocs)
    }
    else if(currWind<0||shaking){
      for (y=0; y<height-terrainHeight;y++){
        if((noise((y*snowNoiseScale),(frameCount*snowNoiseScale))<snowDensity)&&(random(0,1)<snowDensityModifier)){
          append(sideLocs, [width,y])
        }
      }
      //snowLocations = concat(snowLocations, sideLocs)
    }

    if(shaking&&accumulatingSnow){
      

      //console.log("Spawning shaken up snow")
      for (i=0; i<width;i++){
        if((noise((i*snowNoiseScale),(frameCount*snowNoiseScale))<snowDensity)&&(random(0,1)<snowDensityModifier)){
          append(newLocs, [i,height-terrainHeight-2])
          //console.log("Spawnig shaken up snow")
        }
      }
    }
    var allAdditions=concat(sideLocs, newLocs)
    snowLocations = concat(snowLocations, allAdditions)
  }
  
  function generateSunCharacteristics(skyCol){
    sunColor = [random(200, 255),random(200, 255),random(200, 255)]
    sunSize = random(width/20, width/6)
    sunLocation = [random(130, 570),random(50, 250)]
    sunRayMinLength = sunSize*.4
    sunRayMaxLength = sunSize*.8
    sunRayWidth = sunSize *.05
  }  
  
  function drawSun(c, s, loc){
    layerMainGraphics.noStroke()
    layerMainGraphics.fill(c)
    layerMainGraphics.circle(loc[0],loc[1], s)
  }

  function drawSunRays(){
    
    sunLoopTimer +=1
    if(sunLoopTimer>sunRayLoopTime){
      sunLoopTimer=-sunRayLoopTime
    }

    //layerMainGraphics.fill(0)
    //layerMainGraphics.circle(300,300,50)
    
    //layerMainGraphics.stroke(0)
    //layerMainGraphics.strokeWeight(10)
    //layerMainGraphics.line(200,300,500,300)

    //console.log("Sunray count:" + sunRayAngles.length)
    sunRayLength = lerp(sunRayMinLength,sunRayMaxLength,(abs(sunLoopTimer)/sunRayLoopTime))

    for(r =0;r<sunRayAngles.length;r++){
      var rayColor = [sunColor[0],sunColor[1],sunColor[2],120]
      layerMainGraphics.stroke(rayColor)
      layerMainGraphics.strokeWeight(sunRayWidth)
       
      var rayInfo = getSunRayData(degreesToRads(sunRayAngles[r]))
      layerMainGraphics.line(rayInfo[0],rayInfo[1],rayInfo[2],rayInfo[3])
      layerMainGraphics.strokeWeight(1)

      sunRayAngles[r]+=sunSpinRate
    }
  }

  function shake(){
    
    shakeLoopTimer +=1
    shakeTotalTimer+=1
    //console.log("Shake timer: " + shakeLoopTimer)
    
    //Timing the back and fourth shakes
    if(shakeLoopTimer>shakeTimeLoop){
      shakeLoopTimer=-shakeTimeLoop
    }
    //Updating the limit of the shaking animation to decrease during the shake
    shakeXlim=lerp(shakeMaxXlim,0,(shakeTotalTimer/shakeTotalTime))

    //Actual shake animation
    shakeCurrOffset = lerp(-shakeXlim,shakeXlim,(abs(shakeLoopTimer)/shakeTimeLoop))

    //Update limit of side to side snow speed
    shakeCurrMaxSnowSideSpeed =lerp(shakeMaxSnowSideSpeed,0,(shakeTotalTimer/shakeTotalTime))

    //Update actual side to side snow speed
    shakeSnowSideSpeedMod = lerp(shakeCurrMaxSnowSideSpeed,-shakeCurrMaxSnowSideSpeed,(abs(shakeLoopTimer)/shakeTimeLoop))
    
    //Update actual uplift snow speed
    shakeUpSnowSpeedMod= max(lerp(shakeMaxSnowUpSpeed,0,(abs(shakeTotalTimer-1)/(shakeTotalTime/2))),0)

    //Update accumulated snow
    if(shakeTotalTimer<20){
      //console.log("This should run a bunch")

      for(u=0;u<snowPilePositions.length;u++){
        let snowReduction = noise(frameCount*snowPileNoiseScale*0.1, snowPilePositions[u][0]*snowPileNoiseScale, snowPilePositions[u][1]*snowPileNoiseScale)
        if(snowReduction<0.9){
          thisDepth = snowPilePositions[u][2]
          snowPilePositions[u][2] = max(thisDepth-1, 0)
        }
      }

    }  

    //Timing the overall shake time
    if(shakeTotalTimer>shakeTotalTime){
      shakeTotalTimer=0
      shaking=false
      shakeCurrOffset=0
    }

  }

  function getSunRayData(angle){
    
    var edgeX = ((sunSize/1.5)*Math.cos(angle)) + sunLocation[0]
    var edgeY = ((sunSize/1.5)* Math.sin(angle)) + sunLocation[1]

    var termX = (((sunSize/2)+sunRayLength)*Math.cos(angle)) + sunLocation[0]
    var termY = (((sunSize/2)+sunRayLength)* Math.sin(angle)) + sunLocation[1]

    //console.log([edgeX,edgeY,termX,termY])

    return [edgeX,edgeY,termX,termY]
  }

  function degreesToRads(degrees){
    var ret = degrees*(Math.PI/180)
    return ret
  }

  function placePilesOnLeaf(xloc, yloc, radius, topHalfOnly){
    var perim = 2*Math.PI*radius
    var degreesPerStep = 360/perim
    var points = []
    for (b=0;b<perim;b++){
      var xpos = (radius*Math.cos(b*degreesPerStep)) + xloc
      var ypos = (radius* Math.sin(b*degreesPerStep)) + yloc
      //console.log("Point on radius found: " + xpos +"," +ypos)
      if((topHalfOnly&&ypos<yloc)||!topHalfOnly){
        //append(points,[xpos,ypos,0,3])
        append(snowPilePositions, [xpos,height-ypos,0,3])
      }
    }
    //console.log("Found " + counter + " points on circle")
    return points
  }

  function addToUserSeedInput(val){
    
    userSeed = userSeed.concat(val)
    if(userSeed.length>5){
      userSeed=""
    }
  }
  