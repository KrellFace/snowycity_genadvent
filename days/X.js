// Made by Ollie Withington 

function dayXPreload() {

    // Load any assets here (with assets.dayX at the front of the variable name)
}

class DayX extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "Spacebar: New Globe. Left+Right Arrows: Control the Wind. Enter: Shake!"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Ollie Withington"; // Replace with your name
        
        // Define variables here. Runs once during the sketch holder setup

        //Layers
        //this.layerStaticScene = null
        //this.layerDynamicScene = null
        //this.layerTreesOnly = null
        //this.layerSnowGlobe = null
        //this.layerUI = null
        //this.layerGlobeHighlight = null
        this.layerStaticScene = createGraphics(700, 700)
        this.layerDynamicScene = createGraphics(700, 700)
        this.layerTreesOnly = createGraphics(700, 700)
        this.layerSnowGlobe = createGraphics(700, 700) 
        this.layerUI = createGraphics(700, 700) 
        this.layerGlobeHighlight =createGraphics(700, 700);

        //Buildings Variables
        this.minBuildingX = 0

        this.minBuildHeight = 0
        this.maxBuildHeight = 0
        this.minBuildWidth = 0
        this.maxBuildWidth = 0
        this.minBuildGap = 0
        this.maxBuildGap = 0

        this.widthPortionBuildings = 0
        this.buildingData = []

        this.doorHeight = 0
        this.doorWidth = 0

        this.bWindowHeight = 0
        this.bWindowWidth = 0
        this.bWindowGap = 0

        this.minTriangleRoofOdds = 0
        this.maxTriangleRoofOdds = 0.8
        this.oddsOfTriangleRoof = 0

        //Terrain
        this.terrainHeight = 0
        this.bgCol = null
        this.hill1Col = null
        this.hill2Col = null
        this.hill3Col = null
        this.h1Height = 0
        this.h2Height = 0
        this.h3Height = 0
        this.h1Seed = 0
        this.h2Seed = 0
        this.h3Seed = 0
        this.terrainCol = null
        this.darkerTerrain=null
        this.darkestTerrain=null
        this.buildingAnchorCol = []

        //Amount of space either side occupied by snow globe
        this.globeEdgeTrim=130

        //Sun Logic
        this.sunColor = []
        this.sunSize = 0 
        this.sunLocation = [] 

        this.sunRayLoopTime = 100
        this.sunLoopTimer = 0

        this.sunRayWidth = 0
        this.sunRayLength = 0
        this.sunRayMinLength = 0
        this.sunRayMaxLength = 0
        this.sunSpinRate = 0.3

        this.sunRayAngles = [0,45,90,135,180,225,270,315,360]

        //Snow Logic
        this.snowLocations = []
        this.snowDensity = 0.4
        this.snowDensityModifier = 0.05
        this.snowFallingRate = 5
        this.snowNoiseScale = 0.25
        this.swirlScale = 0.05
        this.swirlChaosMod = 20

        this.currWind = 0;
        this.maxWind = 20;
        this.windMod = 0.5
        this.blowingLeft = false;
        this.blowingRight = false;

        //Snow Piles Logic

        this.snowPilePositions=[]
        this.accumulatingSnow= false
        this.snowPileNoiseScale = 0.08

        this.prevDrawnBuilding=[]

        //Trees
        this.minTreeX = 0
        this.minTreeHeight = 0
        this.maxTreeHeight = 0
        this.minBranches = 0
        this.maxBranches = 0
        this.minYOffSetRatio = 0
        this.maxYOffSetRatio = 0
        this.minTreeGap = 0
        this.maxTreeGap = 0
        this.widthPortionTree = 0

        this.treeData = []

        this.treeBranchColor = null 
        this.treeLeafColor = null

        //Shake
        this.shaking = false
        this.shakeMaxXlim=30
        this.shakeXlim=10
        this.shakeCurrOffset = 0
        this.shakeTimeLoop = 5
        this.shakeLoopTimer = 0
        this.shakeTotalTime = 100
        this.shakeTotalTimer = 0
        this.shakeMaxSnowUpSpeed = 10
        this.shakeUpSnowSpeedMod=0
        this.shakeMaxSnowSideSpeed = 20
        this.shakeCurrMaxSnowSideSpeed = 0
        this.shakeSnowSideSpeedMod = 0
        this.maxSnowSwirl = 100
        this.minSnowSwirl = 10
        this.snowSwirlAmount = 10

        // Seed storage

        this.mainSeed = null;
        this.userSeed = "";
        
        this.initialiseGlobeHighlightImg()
    }
    initialise(){     
      
      //Remove all data in case we are regenerating a new city
  
      this.buildingData=[]
      this.treeData=[]
      this.snowLocations=[]
      this.snowPilePositions=[]
      this.accumulatingSnow=false  
      this.layerTreesOnly.clear()
  
      //Generate a new town either based on a user input seed or randomly
      if(this.userSeed!=null&&!isNaN(int(this.userSeed))){
        this.mainSeed = int(this.userSeed)
      }
      else{
        this.mainSeed = int(random(0,10000))
          //console.log(mainSeed) 
      }  
      this.userSeed=""
  
      //Generate Seed
      noiseSeed(this.mainSeed)
      randomSeed(this.mainSeed)
    
      //Generate main pallets
      this.generateColors()
  
      //Generate characteristics of main features
      this.h1Seed = random(0,1000)
      this.h2Seed = this.h1Seed+500
      this.h3Seed = this.h2Seed+1000
      this.terrainHeight = random(130, 130)
      this.generateSunCharacteristics(this.bgCol)  
  
      this.generateBuildingParameters() 
      this.generateBuildingData()   
      this.generateTreeParameters() 
      this.generateTreeData()     
  
      //Draw Static objects and terrain, and place snow pile positions
      this.layerStaticScene.background(this.bgCol);
      this.drawSun(this.sunColor,this.sunSize,this.sunLocation)
      this.generateAllHills()
      this.drawTerrainBase(this.terrainHeight, this.terrainCol, this.darkerTerrain, this.darkestTerrain)
    
      for(var z=0;z<width;z++){
          append(this.snowPilePositions,[z,this.terrainHeight,0,100])
      }
  
      //Reverse order of buildings to prevent snow piles being drawn on top of buildings that appear to be in front
      this.buildingData.reverse()
      for (var i = 0; i<this.buildingData.length; i++){
        this.generateSnowPileDataForBuilding(this.buildingData[i])
      }
      this.buildingData.reverse()
  
      this.drawAllBuildings()
  
      for (var i = 0; i<this.treeData.length; i++){
        this.drawTree(this.treeData[i])
      }
  
      //this.treeData.forEach(this.drawTree)
  
      //Draw unchanging UI elements
      this.drawGlobeAndStaticUI()
    }

    prerun() {
        this.initialise()
        
    }

    update() {

      this.layerDynamicScene.clear()

      this.drawSunRays()

      this.initialiseSnowLocations()

      //Update snow wind
      if(this.blowingRight&&this.currWind<this.maxWind){
        this.currWind+=1
      }else if(this.blowingLeft&&this.currWind>-this.maxWind){
        this.currWind-=1
      }else if(this.currWind<0){
        this.currWind+=1
      }else if(this.currWind>0){
        this.currWind-=1
      }

      //Falling snow
      this.fallingSnowLogic()
      
      if(this.accumulatingSnow){
        if(frameCount%10==0){
          this.updateSnowPiles()
        }
        this.drawSnowPiles() 
      }
 
      if(this.shaking){
        this.shake()
      }
      
      this.drawDynamicUI()

      //Assemble final image
      image(this.layerStaticScene,this.shakeCurrOffset,0)
      image(this.layerDynamicScene,this.shakeCurrOffset,0)
      image(this.layerTreesOnly,this.shakeCurrOffset,0) 
      image(this.layerSnowGlobe,this.shakeCurrOffset,0)
      image(this.layerGlobeHighlight,this.shakeCurrOffset,0)
      image(this.layerUI,0,0)
    }

    // Below are optional functions for interactivity. They can be deleted from this file if you want

    mousePressed() {

    }

    mouseReleased() {

    }

    keyPressed() {
      if(keyCode==32){
        this.initialise()
      }
      else if(keyCode == RIGHT_ARROW){
        this.blowingRight = true
      }
      else if(keyCode == LEFT_ARROW){
        this.blowingLeft = true
      }
      else if(keyCode == LEFT_ARROW){
        this.blowingLeft = true
      }
      //Numeric
      else if(keyCode==13){
        this.shaking=true
      }else if(keyCode==48){
        this.addToUserSeedInput("0")
      }else if(keyCode==49){
        this.addToUserSeedInput("1")
      }else if(keyCode==50){
        this.addToUserSeedInput("2")
      }else if(keyCode==51){
        this.addToUserSeedInput("3")
      }else if(keyCode==52){
        this.addToUserSeedInput("4")
      }else if(keyCode==53){
        this.addToUserSeedInput("5")
      }else if(keyCode==54){
        this.addToUserSeedInput("6")
      }else if(keyCode==55){12
        this.addToUserSeedInput("7")
      }else if(keyCode==56){
        this.addToUserSeedInput("8")
      }else if(keyCode==57){
        this.addToUserSeedInput("9")
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

    
  //Dedicated layer for a highlight to (hopefully) give the snow globe a 3D effect
   initialiseGlobeHighlightImg(){
    this.layerGlobeHighlight.fill([255,255,255,35])
    this.layerGlobeHighlight.noStroke()
    this.layerGlobeHighlight.circle((width/2),(height/2)-20,550)

    this.layerGlobeHighlight.erase()
    this.layerGlobeHighlight.noStroke() 
    this.layerGlobeHighlight.circle((width/2),(height/2)-20,520) 
    this.layerGlobeHighlight.noErase()

    this.layerGlobeHighlight.erase()
    this.layerGlobeHighlight.noStroke()
    this.layerGlobeHighlight.rect(0,240,700,500)
    this.layerGlobeHighlight.noErase()
    this.layerGlobeHighlight.erase()
    this.layerGlobeHighlight.noStroke()
    this.layerGlobeHighlight.rect(380,0,440,700)
    this.layerGlobeHighlight.noErase()
  }
  
  calcWindowData(houseWidth, houseHeight){
    var horiWindowCount = floor((houseWidth-this.bWindowGap)/(this.bWindowWidth+this.bWindowGap))
    var vertWindowCount = floor((houseHeight-this.doorHeight-this.bWindowGap)/(this.bWindowWidth+this.bWindowGap))
    
    var horiSideGap = (houseWidth-(horiWindowCount*(this.bWindowWidth+this.bWindowGap))+this.bWindowGap)/2
    
    return [horiWindowCount,vertWindowCount,horiSideGap]
  }

  drawBuilding(bd){
  
    //Generate base building
    var bOutlineCol = [bd[3][0]-10, bd[3][1]-10,bd[3][2]-10]
    
    this.layerStaticScene.stroke(bOutlineCol)
    this.layerStaticScene.fill(bd[3])
    
    var buildYloc = height-this.terrainHeight-bd[2]-1
    
    this.layerStaticScene.rect(bd[0], buildYloc, bd[1], bd[2])

    //Generate Pointed roof
    if(bd[4]==true){

      this.layerStaticScene.fill(bd[3])
      this.layerStaticScene.stroke(color(bd[3][0]-50,bd[3][1]-50,bd[3][2]-50)) 
      this.layerStaticScene.triangle(bd[0], buildYloc, bd[0]+bd[1], buildYloc, bd[0]+(bd[1]/2), buildYloc-(bd[1]/2));
    }
    
    //Generating DoorWay 
    this.layerStaticScene.fill(color(bd[3][0]-50,bd[3][1]-50,bd[3][2]-50))
         
    this.layerStaticScene.rect(bd[0]+(bd[1]/2)-(this.doorWidth/2), height-this.terrainHeight-this.doorHeight-1, this.doorWidth, this.doorHeight)
    
  
    var wData = this.calcWindowData(bd[1],bd[2])
    var horiWindowCount = wData[0]
    var vertWindowCount = wData[1]
    var horiSideGap = wData[2]
    
    
    for (var x=0;x<horiWindowCount;x++){
      for (var y=0;y<vertWindowCount;y++){
          
        var xloc = bd[0]+horiSideGap+(x*(this.bWindowWidth+this.bWindowGap))
        var yloc = buildYloc+this.bWindowGap+(y*(this.bWindowWidth+this.bWindowGap))
        this.layerStaticScene.fill(color(bd[3][0]-50,bd[3][1]-50,bd[3][2]-50))
        this.layerStaticScene.rect(xloc, yloc, this.bWindowWidth, this.bWindowWidth)
        
        
      }
    }
    
    //return buildingWidth
  }
  
  
  drawAllBuildings(){
    for(var i=0;i<this.buildingData.length;i++){
      this.drawBuilding(this.buildingData[i])
    }
  }
  
  drawTerrainBase(h, c1,c2,c3){
    this.layerStaticScene.noStroke()
    this.layerStaticScene.fill(c1)
    this.layerStaticScene.rect(0, height-h, width, h)
    this.layerStaticScene.noStroke()
    this.layerStaticScene.fill(c2)
    this.layerStaticScene.rect(0, height-(h*.9), width, h)
    this.layerStaticScene.noStroke()
    this.layerStaticScene.fill(c3)
    this.layerStaticScene.rect(0, height-(h*.8), width, h) 
  }
  
  generateColors(){  
    //Color Gen
    let bgCols = [random(200, 255),random(200, 255),random(200, 255)]
    this.bgCol = color(bgCols)
  
    this.h1Height = random((height*(2/3)), (height))
    
    //h1Height = random(700, 1000)
    let h1Cols = this.generateProximalColor(bgCols,30, 50, true) 
    this.hill1Col = color(append(h1Cols,255))
    
    this.h2Height = random((this.h1Height-((height-this.h1Height)*(1/50)), (this.h1Height-((height-this.h1Height)*(1/40)))))
    //h2Height = random(h1Height-5, h1Height-10)  
    let h2Cols = this.generateProximalColor(h1Cols,30, 50, true)
    this.hill2Col = color(append(h2Cols,255))
    
    this.h3Height = random((this.h2Height-((height-this.h2Height)*(1/50)), ((height-this.h2Height)-(height*(1/40)))))
    let h3Cols = this.generateProximalColor(h2Cols,30, 50, true)
    this.hill3Col = color(append(h3Cols,255))
     
    this.buildingAnchorCol = this.generateProximalColor(h3Cols, 100, 60)
    
    this.terrainCol = this.generateProximalColor(h3Cols,30, 50, true)
    this.darkerTerrain=this.generateProximalColor(this.terrainCol,50,40, true)
    this.darkestTerrain=this.generateProximalColor(this.darkerTerrain,50,40, true)
    
    
    this.treeLeafColor = this.generateProximalColor(this.buildingAnchorCol,80, 120)
    this.treeBranchColor = this.generateProximalColor(this.treeLeafColor,120, 120)
    append(this.treeLeafColor,200)
  }
  
  generateBuildingParameters(){
    this.minBuildHeight = random(60, 90)
    this.maxBuildHeight = random(this.minBuildHeight+35, this.minBuildHeight+220)
    this.minBuildWidth = random(14, 50)
    this.maxBuildWidth = random(this.minBuildWidth+14, this.minBuildWidth+28)
    this.minBuildGap = random(-12, 12)
    this.maxBuildGap = random(max((this.minBuildGap+12), 0), max(this.minBuildGap+28, 10))
    
    this.widthPortionBuildings = random(0.15, 0.2) 
    
    this.doorWidth = random(this.minBuildWidth/6,this.minBuildWidth/3)
    this.doorHeight = min((this.doorWidth*2.5 ),this.minBuildHeight/2)
    
    this.bWindowHeight = this.doorWidth 
    this.bWindowWidth = this.doorWidth
    this.bWindowGap = this.doorWidth/2

    this.oddsOfTriangleRoof = random(this.minTriangleRoofOdds, this.maxTriangleRoofOdds)
  }
  
  generateTreeParameters(){
    
    this.maxTreeHeight = random(30,79)
    this.minTreeHeight = random(this.maxTreeHeight*.5,this.maxTreeHeight*.7)
    this.minBranches = int(random(4,8))
    this.maxBranches = int(random(this.minBranches,this.minBranches+6))
    this.minYOffSetRatio = random(-0.4,0.4)
    this.maxYOffSetRatio = random(this.minYOffSetRatio-.1, this.minYOffSetRatio+.1)
    this.minTreeGap = random(-(width*(1/60)), (width*(1/40)))
    this.maxTreeGap = random(max(this.minTreeGap+(width*(1/40)), 0), max(this.minTreeGap+(width*(1/25)), 10))
    this.widthPortionTree = random(0.12, 0.17)
  }
  
  generateAllHills(){ 
    
    this.drawHill(this.h1Height, color(this.hill1Col), this.h1Seed)
    this.drawHill(this.h2Height, color(this.hill2Col), this.h2Seed)
    this.drawHill(this.h3Height, color(this.hill3Col), this.h3Seed)
  }
   
  generateBuildingData(){
    for (var i=this.globeEdgeTrim; i<width-this.globeEdgeTrim; i++){
      var val = noise(i)
      var genBuilding = false
      if(val<this.widthPortionBuildings){
        //Clunky handling for only checking the gap if there is already a building added
        if(this.buildingData.length>0){
          if(i>this.buildingData[this.buildingData.length-1][0]+(width*(1/50))){
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
        var generationLoc = i
        var buildingWidth = random(this.minBuildWidth, this.maxBuildWidth)
        var buildingHeight = random(this.minBuildHeight, this.maxBuildHeight)
        var triangleRoof = random(0,1)<this.oddsOfTriangleRoof
        //console.log(triangleRoof  )
        var bd=[i,buildingWidth,buildingHeight,this.generateProximalColor(this.buildingAnchorCol,0,30),triangleRoof]
        append(this.buildingData,bd)
        
        
      }
    }
    
    //console.log("All building data generated")
  }
  
  generateTreeData(){
    
    for (var i=this.globeEdgeTrim; i<width-this.globeEdgeTrim; i++){
      //console.log("i:")
      //console.log(i)
      
      var val = noise(i+1000)   
      var genTree= false
      if(val<this.widthPortionTree){
        //Clunky handling for only checking the gap if there is already a building added
        if(this.treeData.length>0){
          if(i>this.treeData[this.treeData.length-1][0][0][0]+(width*(1/100))){
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
        var branches = []
        var leaves = []
        var treeHeight = random(this.minTreeHeight,this.maxTreeHeight)
        var branchCount = int(random(this.minBranches, this.maxBranches))
        var treeBaseYLoc = height-this.terrainHeight
        var treeTopYLoc = height-this.terrainHeight-treeHeight

        var branchYOffsetRatio = random(this.minYOffSetRatio, this.maxYOffSetRatio)
        //Main stem
        append(branches,[i, treeBaseYLoc,i, treeTopYLoc,5])

        //End leaf
        append(leaves,[i, height-this.terrainHeight-(treeHeight*.95),treeHeight*.4])
        this.placePilesOnLeaf(i,height-this.terrainHeight-(treeHeight*.95),  (treeHeight*.4)/2, true)

        //Sub branches
        let branchMinRoot = treeBaseYLoc-(treeHeight*.2)
        var maxBranchXLength = (treeHeight*.5)
        var prevBranchLeft = false
        for(var q=0;q<branchCount;q++){
          var gapToTop = treeTopYLoc-branchMinRoot
          var root = random(branchMinRoot,branchMinRoot+(gapToTop/2))
          var branchXLength = random(maxBranchXLength/2, maxBranchXLength)
          var branchY = abs(branchXLength)*branchYOffsetRatio
          if(!prevBranchLeft){
            branchXLength=-branchXLength
          }
          prevBranchLeft=!prevBranchLeft    
          
          
          append(branches,[i, root,i+branchXLength, root+branchY ,3])
          //End leaf
          append(leaves,[i+(branchXLength*.95), root+(branchY*.95),branchXLength*.6])
          var cachedLength = branchXLength
          //console.log("Cached length: " + cachedLength)
          this.placePilesOnLeaf(i+(cachedLength*.95),root+(branchY*.95), abs((cachedLength*.6)/2), true)
          maxBranchXLength=abs(branchXLength)
          branchMinRoot=root
        }

        var td = [branches,leaves]
        //console.log(leaves.length)
        append(this.treeData,td)
        
        
      }
    }
    
  }
  
  drawTree(td){ 
    
    //Draw branches
    for(var i = 0; i<td[0].length;i++){
      this.layerTreesOnly.stroke(this.treeBranchColor)
      this.layerTreesOnly.strokeWeight(td[0][i][4])
      this.layerTreesOnly.line(td[0][i][0],td[0][i][1],td[0][i][2],td[0][i][3])
    }
    //Draw Leaves
    for(var j = 0; j<td[1].length;j++){
      var leavesData= td[1][j] 
      this.layerTreesOnly.noStroke()
      //layerTreesOnly.fill(treeLeafColor)
      this.layerTreesOnly.fill(this.generateProximalColor(this.treeLeafColor,0, 20))
      this.layerTreesOnly.circle(leavesData[0],leavesData[1],leavesData[2])
    }  
  }
  
  generateSnowPileDataForBuilding(bd){
    //Updating snow height map
    var bx1 = bd[0]
    var bWidth = bd[1]
    var bHeight = bd[2]
    
    var by1=(bHeight+this.terrainHeight)
    var bx2=bx1+bWidth
    var by2=this.terrainHeight
    
    //Triangle Roof Piles
    if(bd[4]==true){ 
      //Left half of roof
      for(var l=0;l<(bWidth/2);l++){ 
        var xPos =bx1+l
        var yPos = by1+l+2
        if(!(xPos>this.prevDrawnBuilding[0]&&xPos<+this.prevDrawnBuilding[2]&&yPos<this.prevDrawnBuilding[1]&&yPos>this.prevDrawnBuilding[3])){
          
          append(this.snowPilePositions,[xPos,yPos,0,int((this.bWindowHeight/2))])
        }
      }
      for(var r=(bWidth/2);r<bWidth;r++){  
        var xPos =bx1+r
        var yPos = by1+bWidth-r+2
        if(!(xPos>this.prevDrawnBuilding[0]&&xPos<this.prevDrawnBuilding[2]&&yPos<this.prevDrawnBuilding[1]&&yPos>this.prevDrawnBuilding[3])){
          
          append(this.snowPilePositions,[xPos,yPos,0,int(this.bWindowHeight/2)])
        }
      }
    }
    else{
       
      //Roof snow piles
      
      for(var k=bx1;k<(bx1+bWidth);k++){ 
        
        if(!(k>this.prevDrawnBuilding[0]&&k<this.prevDrawnBuilding[2]&&by1<this.prevDrawnBuilding[1]&&by1>this.prevDrawnBuilding[3])){
          
          append(this.snowPilePositions,[k,by1,0,int(this.bWindowHeight/2)])
        }
      }

    }
    var wData = this.calcWindowData(bd[1],bd[2])
    var horiWindowCount = wData[0]
    var vertWindowCount = wData[1]
    var horiSideGap = wData[2]
  
  
    for (var x=0;x<horiWindowCount;x++){  
      for (var y=0;y<vertWindowCount;y++){   
        for(var w=0;w<this.bWindowWidth;w++){
          
          var xLoc=bx1+horiSideGap+(x*(this.bWindowWidth+this.bWindowGap))+w
          var yLoc = by1-this.bWindowGap-(y*(this.bWindowWidth+this.bWindowGap))-this.bWindowWidth
          if(!(xLoc>this.prevDrawnBuilding[0]&&xLoc<+this.prevDrawnBuilding[2]&&yLoc<this.prevDrawnBuilding[1]&&yLoc>this.prevDrawnBuilding[3])){
            append(this.snowPilePositions,[xLoc,yLoc,0, int(this.bWindowHeight/2)])
          }
          
        }
      }
  
    }

    //Increase the stored height if drawing a triangle roof

    
    if(bd[4]==true){
      by1+=(bWidth/2)
    }
    
    
    this.prevDrawnBuilding = [bx1,by1,bx2,by2]
  }
  
  generateProximalColor(col, minDist, maxDistPerVal, darkerOnly = false, lighterOnly = false){
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
      for(var i = 0; i<2;i++){
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

  drawGlobeAndStaticUI(){
    
     //Snow globe main rim
     this.layerSnowGlobe.background(30)
     this.layerSnowGlobe.stroke([217,242,255])
     //layerSnowGlobe.noFill()
     this.layerSnowGlobe.strokeWeight(11)
     this.layerSnowGlobe.circle(width/2,height/2,655)

     //Snow globe sunlit rim
     this.layerSnowGlobe.stroke(this.sunColor)
     this.layerSnowGlobe.strokeWeight(3)
     this.layerSnowGlobe.circle(width/2,height/2,655)

     this.layerSnowGlobe.strokeWeight(1)
       
     //Snow globe cut out
     this.layerSnowGlobe.erase()
     this.layerSnowGlobe.noStroke()
     this.layerSnowGlobe.circle(width/2,height/2,653)
     this.layerSnowGlobe.noErase()
     
     
     //Draw wood base
     this.layerSnowGlobe.fill([156,96,44]) 
     this.layerSnowGlobe.stroke([122,77,37])
     this.layerSnowGlobe.rect(160,630,380,70)

     this.layerSnowGlobe.fill([76,47,18])
     this.layerSnowGlobe.stroke([54,32,12])
     this.layerSnowGlobe.rect(120,650,460,50)

     //Draw Gold Plaque

     this.layerSnowGlobe.fill([99, 76, 37])
     this.layerSnowGlobe.noStroke()
     this.layerSnowGlobe.strokeWeight(1)
     this.layerSnowGlobe.rect(147,657,406,36)
     
     this.layerSnowGlobe.fill([156, 112, 37])
     this.layerSnowGlobe.stroke([82, 59, 20])
     this.layerSnowGlobe.strokeWeight(1)
     this.layerSnowGlobe.rect(150,660,400,30)

     //Gold plaque bolts
     this.layerSnowGlobe.fill(80)
     this.layerSnowGlobe.circle(157,667,10)
     //layerGlobeHighlight.fill(80)
     this.layerSnowGlobe.circle(543,667,10)
     //layerGlobeHighlight.fill(80)
     this.layerSnowGlobe.circle(157,683,10)
     //layerGlobeHighlight.fill(80)
     this.layerSnowGlobe.circle(543,683,10)
     

     

     //Draw Globe Text
     
     this.layerSnowGlobe.fill([43, 34, 18])
     this.layerSnowGlobe.noStroke()
     this.layerSnowGlobe.textSize(24);
     this.layerSnowGlobe.text('Globe #' + this.mainSeed, 290, 682);
     this.layerSnowGlobe.strokeWeight(1)
     

  }

  drawDynamicUI(){

     //Draw Curr User input
     //layerUI = createGraphics(700, 700) 
     this.layerUI.fill(80)
     this.layerUI.rect(7,14,175,40)
     this.layerUI.fill(220)
     //layerUI.noStroke()
     this.layerUI.textSize(20);
     var dotFlicker = ""
     if(frameCount%40<20){567
       dotFlicker= "_"
     }
     this.layerUI.text('Input ID: ' + this.userSeed+dotFlicker, 10, 40);
  }
  
  drawHill(h, col, seed){
  
    var noiseScale = 0.006;
    for (let x = 0; x < width; x += 1) {
      // Scale input coordinates.
      var nx = noiseScale * x;
      var nt = noiseScale * seed;
      // Compute noise value.
      var y = h * noise(nx, nt);
      // Render.
      this.layerStaticScene.stroke(col)
      this.layerStaticScene.line(x, height, x, height-y);
    }
  }
  
  initialiseSnowLocations(){
    //console.log("Generating snow locations ")
    var newLocs = []
    var sideLocs = []
    var allAdditions=[]
    for (var i=0; i<width;i++){
      if((noise((i*this.snowNoiseScale),(frameCount*this.snowNoiseScale))<this.snowDensity)&&(random(0,1)<this.snowDensityModifier)){
        append(newLocs, [i,0])
      }
    }
    if(this.currWind>0||this.shaking){
      for (var y=0; y<height-this.terrainHeight;y++){
        if((noise((y*this.snowNoiseScale),(frameCount*this.snowNoiseScale))<this.snowDensity)&&(random(0,1)<this.snowDensityModifier)){
          append(sideLocs, [0,y])
        }
      }
      //snowLocations = concat(snowLocations, sideLocs)
    }

    else if(this.currWind<0||this.shaking){
      for (var y=0; y<height-this.terrainHeight;y++){
        if((noise((y*this.snowNoiseScale),(frameCount*this.snowNoiseScale))<this.snowDensity)&&(random(0,1)<this.snowDensityModifier)){
          append(sideLocs, [width,y])
        }
      }
      //snowLocations = concat(snowLocations, sideLocs)
    }

    if(this.shaking&&this.accumulatingSnow){
      

      //console.log("Spawning shaken up snow")
      for (var i=0; i<width;i++){
        if((noise((i*this.snowNoiseScale),(frameCount*this.snowNoiseScale))<this.snowDensity)&&(random(0,1)<this.snowDensityModifier)){
          append(newLocs, [i,height-this.terrainHeight-2])
          //console.log("Spawnig shaken up snow")
        }
      }
    }
    var allAdditions=concat(sideLocs, newLocs)
    this.snowLocations = concat(this.snowLocations, allAdditions)
  }
  
  generateSunCharacteristics(skyCol){
    this.sunColor = [random(200, 255),random(200, 255),random(200, 255)]
    this.sunSize = random(35, 70)
    this.sunLocation = [random(130, 570),random(50, 250)]
    this.sunRayMinLength = this.sunSize*.4
    this.sunRayMaxLength = this.sunSize*.8
    this.sunRayWidth = this.sunSize *.05
  }  
  
  drawSun(c, s, loc){
    this.layerStaticScene.noStroke()
    this.layerStaticScene.fill(c)
    this.layerStaticScene.circle(loc[0],loc[1], s)
  }

  fallingSnowLogic(){
    for(var i=0;i<this.snowLocations.length;i++){
      //console.log(snowLocations[i])
      this.snowLocations[i][1]+=(this.snowFallingRate-this.shakeUpSnowSpeedMod)
      var chaos = random(-this.swirlChaosMod,this.swirlChaosMod)
      var swirl = (noise(((this.snowLocations[i][0]+chaos)*this.swirlScale),((this.snowLocations[i][1]+chaos)*this.swirlScale),(frameCount*this.swirlScale))*this.snowSwirlAmount)-(this.snowSwirlAmount/2)

      this.snowLocations[i][0]+=((swirl)+(this.currWind*this.windMod)+this.shakeSnowSideSpeedMod)
      this.layerDynamicScene.fill(255,255,255)
      this.layerDynamicScene.noStroke()
      //stroke(255)
      this.layerDynamicScene.circle(this.snowLocations[i][0], this.snowLocations[i][1], random(1,5));
      var belowTerrain = this.snowLocations[i][1]>(height-this.terrainHeight-3)
      var aboveGlobe = this.snowLocations[i][1]<(0)
      if(belowTerrain||aboveGlobe){
        //snowLocations.shift()
        this.snowLocations.splice(i, 1)
        if(!this.accumulatingSnow&&belowTerrain){
          this.accumulatingSnow=true
        }
      }
    }
  }

  updateSnowPiles(){
    for(var i=0;i<this.snowPilePositions.length;i++){
            
      var snowChange = noise(frameCount*this.snowPileNoiseScale*0.1, this.snowPilePositions[i][0]*this.snowPileNoiseScale, this.snowPilePositions[i][1]*this.snowPileNoiseScale)
      //console.log(snowChange)
      snowChange-=.48
      var absChange = abs(snowChange)
      //console.log(snowChange)
      var currDepth = this.snowPilePositions[i][2]
      var maxDepth = this.snowPilePositions[i][3]

      //if(absChange/2>random(0,1)&&leftDepth<3&&rightDepth<3){
      if(absChange/2>random(0,1)){   
      //Decrease depth
        if(snowChange<0){
            //console.log("Decrease depth")
            this.snowPilePositions[i][2] = max(currDepth-1, 0)
        }
        else{
          this.snowPilePositions[i][2] = min(currDepth+1, maxDepth)
        }
      }
      
      //Draw snow
      //this.layerDynamicScene.stroke([255,255,255])
      //this.layerDynamicScene.line(this.snowPilePositions[i][0],height-this.snowPilePositions[i][1],this.snowPilePositions[i][0],height-this.snowPilePositions[i][1]-this.snowPilePositions[i][2])
    }  
    //this.drawSnowPiles()
  }

  drawSnowPiles(){
    for(var i=0;i<this.snowPilePositions.length;i++){
      if(this.snowPilePositions[i][2]>0){
        this.layerDynamicScene.stroke([255,255,255])
        this.layerDynamicScene.line(this.snowPilePositions[i][0],height-this.snowPilePositions[i][1],this.snowPilePositions[i][0],height-this.snowPilePositions[i][1]-this.snowPilePositions[i][2])
      }}
  }

  drawSunRays(){
    
    this.sunLoopTimer +=1
    if(this.sunLoopTimer>this.sunRayLoopTime){ 
      this.sunLoopTimer=-this.sunRayLoopTime
    }
    //console.log("Sunray count:" + sunRayAngles.length)
    this.sunRayLength = lerp(this.sunRayMinLength,this.sunRayMaxLength,(abs(this.sunLoopTimer)/this.sunRayLoopTime))

    for(var r =0;r<this.sunRayAngles.length;r++){
      var rayColor = [this.sunColor[0],this.sunColor[1],this.sunColor[2],120]
      this.layerDynamicScene.stroke(rayColor)
      this.layerDynamicScene.strokeWeight(this.sunRayWidth)
       
      var rayInfo = this.getSunRayData(this.degreesToRads(this.sunRayAngles[r]))
      this.layerDynamicScene.line(rayInfo[0],rayInfo[1],rayInfo[2],rayInfo[3])
      this.layerDynamicScene.strokeWeight(1)

      this.sunRayAngles[r]+=this.sunSpinRate
    }
  }

  shake(){
    
    this.shakeLoopTimer +=1
    this.shakeTotalTimer+=1
    //console.log("Shake timer: " + shakeLoopTimer)
    
    //Timing the back and fourth shakes
    if(this.shakeLoopTimer>this.shakeTimeLoop){
      this.shakeLoopTimer=-this.shakeTimeLoop
    }
    //Updating the limit of the shaking animation to decrease during the shake
    this.shakeXlim=lerp(this.shakeMaxXlim,0,(this.shakeTotalTimer/this.shakeTotalTime))

    //Actual shake animation
    this.shakeCurrOffset = lerp(-this.shakeXlim,this.shakeXlim,(abs(this.shakeLoopTimer)/this.shakeTimeLoop))

    //Update limit of side to side snow speed
    this.shakeCurrMaxSnowSideSpeed =lerp(this.shakeMaxSnowSideSpeed,0,(this.shakeTotalTimer/this.shakeTotalTime))

    //Update actual side to side snow speed
    this.shakeSnowSideSpeedMod = lerp(this.shakeCurrMaxSnowSideSpeed,-this.shakeCurrMaxSnowSideSpeed,(abs(this.shakeLoopTimer)/this.shakeTimeLoop))
    
    //Update actual uplift snow speed
    this.shakeUpSnowSpeedMod= max(lerp(this.shakeMaxSnowUpSpeed,0,(abs(this.shakeTotalTimer-1)/(this.shakeTotalTime/2))),0)

    //Update snow swirl amount
    this.snowSwirlAmount = max(lerp(this.maxSnowSwirl,this.minSnowSwirl,(abs(this.shakeTotalTimer-1)/(this.shakeTotalTime/2))),this.minSnowSwirl)

    //Update accumulated snow
    if(this.shakeTotalTimer<20){
      //console.log("This should run a bunch")

      for(var u=0;u<this.snowPilePositions.length;u++){
        let snowReduction = noise(frameCount*this.snowPileNoiseScale*0.1, this.snowPilePositions[u][0]*this.snowPileNoiseScale, this.snowPilePositions[u][1]*this.snowPileNoiseScale)
        if(snowReduction<0.9){
          var thisDepth = this.snowPilePositions[u][2]
          this.snowPilePositions[u][2] = max(thisDepth-1, 0)
        }
      }

    }  

    //Timing the overall shake time
    if(this.shakeTotalTimer>this.shakeTotalTime){
      this.shakeTotalTimer=0
      this.shaking=false
      this.shakeCurrOffset=0
    }

  }

  getSunRayData(angle){
    
    var edgeX = ((this.sunSize/1.5)*Math.cos(angle)) + this.sunLocation[0]
    var edgeY = ((this.sunSize/1.5)* Math.sin(angle)) + this.sunLocation[1]

    var termX = (((this.sunSize/2)+this.sunRayLength)*Math.cos(angle)) + this.sunLocation[0]
    var termY = (((this.sunSize/2)+this.sunRayLength)* Math.sin(angle)) + this.sunLocation[1]

    //console.log([edgeX,edgeY,termX,termY])

    return [edgeX,edgeY,termX,termY]
  }

  degreesToRads(degrees){
    var ret = degrees*(Math.PI/180)
    return ret
  }

  placePilesOnLeaf(xloc, yloc, radius, topHalfOnly){
    var perim = 2*Math.PI*radius
    var degreesPerStep = 360/perim
    var points = []
    for (var b=0;b<perim;b++){
      var xpos = (radius*Math.cos(b*degreesPerStep)) + xloc
      var ypos = (radius* Math.sin(b*degreesPerStep)) + yloc
      //console.log("Point on radius found: " + xpos +"," +ypos)
      if((topHalfOnly&&ypos<yloc)||!topHalfOnly){
        //append(points,[xpos,ypos,0,3])
        append(this.snowPilePositions, [xpos,height-ypos,0,3])
      }
    }
    //console.log("Found " + counter + " points on circle")
    return points
  }

  addToUserSeedInput(val){
    
    this.userSeed = this.userSeed.concat(val)
    if(this.userSeed.length>5){
      this.userSeed=""
    }
  }
}