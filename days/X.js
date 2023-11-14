// Made by Firstname Lastname (keep this line and replace with your name)
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

doorHeight = 0
doorWidth = 0

bWindowHeight = 0
bWindowWidth = 0
bWindowGap = 0

//Terrain
bgCol = null
hill1Col = null
hill2Col = null
hill3Col = null
h1Height = 0
h2Height = 0
h3Height = 0
h1Seed = 0
h2Seed = 0
h3Seed = 0
terrainCol = null
buildingAnchorCol = []

//Sun Logic
sunColor = []
sunSize = 0
sunLocation = []


//Snow Logic
snowLocations = []
snowDensity = 0.4
snowDensityModifier = 0.05
snowFallingRate = 5
snowNoiseScale = 0.25
snowSwirlAmount = 10
swirlScale = 0.05
swirlChaosMod = 20

currWind = 0;
maxWind = 20;
windMod = 0.5
blowingLeft = false;
blowingRight = false;

//Snow Piles Logic

snowPilePositions=[]
accumulatingSnow= false
snowPileNoiseScale = 0.08

prevBuilding=[]


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

treeBranchColor = null
treeLeafColor = null

// Seed storage

mainSeed = null;
userSeed = null;
seedDisplay=null;
inp=null;
function dayXPreload() {

    // Load any assets here (with assets.dayX at the front of the variable name)
}



class DayX extends Day {

    constructor () {

        super();
        this.loop = true; // Set to true or false

        this.controls = "Press the left or right arrow keys to control the wind. Press Spacebar to generate a new town"; // Write any controls for interactivity if needed or leave blank
        this.credits = "Made by Ollie Withington"; // Replace with your name

        // Define variables here. Runs once during the sketch holder setup
        /* 
        let inpExplain = createDiv('Input Seed:');
        inpExplain.style('font-size', '16px');
        inpExplain.position(340,785);
        
        let button = createButton('New Town');
        button.position(950,778);
        //button.position(50, 50);
        button.size(80,30)
        button.mousePressed(initialise);
        */
    }

    prerun() {

        // Initialise/reset variables here. Runs once, every time your day is viewed
        //createCanvas(700,700);  
  

  
        //Create UI bits
        /*
        let inpExplain = createDiv('Input Seed:');
        inpExplain.style('font-size', '16px');
        inpExplain.position(340,785);
        
        let button = createButton('New Town');
        button.position(950,778);
        //button.position(50, 50);
        button.size(80,30)
        button.mousePressed(initialise);
        */

        
        
        
        initialise()
        
    }

    update() {

      // Update and draw stuff here. Runs continuously (or only once if this.loop = false), while your day is being viewed
      //console.log("Updating")
      //background(200); // You can delete this line if you want
      if(allBuildingsDrawn!=true){

        buildingDrawIncrementer+=1
        if(buildingDrawIncrementer>buildingDrawRate){
        
          drawBuilding(buildingData[buildingCounter])
          buildingCounter+=1
          buildingDrawIncrementer = 0
          
          if(buildingCounter>buildingData.length-1){
            console.log("All buildings drawn")
            allBuildingsDrawn=true
          }
        }
      }
      //Snow drawing
      else{
      
        background(bgCol);
        drawSun(sunColor,sunSize,sunLocation)
        drawHill(h1Height, color(hill1Col), h1Seed)
        drawHill(h2Height, color(hill2Col), h2Seed)
        drawHill(h3Height, color(hill3Col), h3Seed)
    
        //Terrain Gen
        drawTerrainBase(terrainHeight, terrainCol)
    
        drawAllBuildings()
        //console.log(treeData.length)
        
        treeData.forEach(drawTree)
        strokeWeight(1)
    
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

        console.log("Wind mod:" + currWind)
    
        //Falling snow
        for(i=0;i<snowLocations.length;i++){
          //console.log(snowLocations[i])
          snowLocations[i][1]+=snowFallingRate
          let chaos = random(-swirlChaosMod,swirlChaosMod)
          let swirl = (noise(((snowLocations[i][0]+chaos)*swirlScale),((snowLocations[i][1]+chaos)*swirlScale),(frameCount*swirlScale))*snowSwirlAmount)-(snowSwirlAmount/2)
  
          //swirl+=random(-swirlChaosMod,swirlChaosMod)
          snowLocations[i][0]+=(swirl+(currWind*windMod))
          fill(255,255,255)
          noStroke()
          //stroke(255)
          circle(snowLocations[i][0], snowLocations[i][1], random(1,5));
          //point(snowLocations[i][0], snowLocations[i][1])
          if(snowLocations[i][1]>(height-terrainHeight-3)){
            //snowLocations.shift()
            snowLocations.splice(i, 1)
            if(!accumulatingSnow){
                accumulatingSnow=true
                
            }
          }
        }
      }
        
      if(accumulatingSnow){
        for(let b=0;b<snowPilePositions.length;b++){
            
          let snowChange = noise(frameCount*snowPileNoiseScale*0.1, snowPilePositions[b][0]*snowPileNoiseScale, snowPilePositions[b][1]*snowPileNoiseScale)
          //console.log(snowChange)
          snowChange-=.48
          let absChange = abs(snowChange)
          //console.log(snowChange)
          let currDepth = snowPilePositions[b][2]
          let maxDepth = snowPilePositions[b][3]
          let leftDepth = 0
          if(b!=0){
            leftDepth = abs(currDepth,snowPilePositions[b-1][2])
          }
          let rightDepth = 0
          if(b<snowPilePositions.length-1){
            rightDepth = abs(currDepth,snowPilePositions[b+1][2])
          }
          if(absChange/2>random(0,1)&&leftDepth<3&&rightDepth<3){
          //Decrease depth
            if(snowChange<0){
                //console.log("Decrease depth")
                snowPilePositions[b][2] = max(currDepth-1, 2)
            }
            else{
                snowPilePositions[b][2] = min(currDepth+1, maxDepth)
            }
          }
          
          //Draw snow
          stroke([255,255,255])
          line(snowPilePositions[b][0],height-snowPilePositions[b][1],snowPilePositions[b][0],height-snowPilePositions[b][1]-snowPilePositions[b][2])
        }  
      }
      //Draw trees last so they are in front of snowy windows
      treeData.forEach(drawTree)
      strokeWeight(1) 
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
    if(seedDisplay!=null){
        seedDisplay.remove()
    }
    if(inp!=null){ 
        inp.remove()
    }




    if(userSeed!=null&&!isNaN(int(userSeed))){
        mainSeed = int(userSeed)
        userSeed=null
        inp.value=''
    }
    else{
        mainSeed = int(random(0,1000))
        console.log(mainSeed)
    }  

    //Create UI bits
    /*
    seedDisplay = createDiv('Seed: ' +mainSeed);
    seedDisplay.style('font-size', '16px',(255,255,255));
    seedDisplay.style.color = (255,255,255)
    seedDisplay.position(10, height-30);


    inp = createInput('');
    inp.position(width/2-40, height-30);
    inp.size(100);
    inp.input(inputSeed);
    */


    //Generate Seed
    noiseSeed(mainSeed)
    randomSeed(mainSeed)

    generateColors()            

    background(bgCol);

    generateSunCharacteristics(bgCol)
    drawSun(sunColor,sunSize,sunLocation)

    h1Seed = random(0,1000)
    h2Seed = h1Seed+500
    h3Seed = h3Seed+1000

    generateAllHills()

    //Terrain Gen
    terrainHeight = random((height*(1/20)), (height*(1/15)))
    drawTerrainBase(terrainHeight, terrainCol)

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


function inputSeed(){
    console.log('you are typing: ', this.value());
    userSeed=this.value()
  }
  
  function drawBuilding(bd){
  
    //Generate base building
    bOutlineCol = [bd[3][0]-10, bd[3][1]-10,bd[3][2]-10]
    
    stroke(bOutlineCol)
    fill(bd[3])
    
    buildYloc = height-terrainHeight-bd[2]-1
    
    rect(bd[0], buildYloc, bd[1], bd[2])
    
    //Generating DoorWay
    fill(color(bd[3][0]-50,bd[3][1]-50,bd[3][2]-50))
         
    rect(bd[0]+(bd[1]/2)-(doorWidth/2), height-terrainHeight-doorHeight-1, doorWidth, doorHeight)
    
    //Generating Windows
    //horiWindowCount = floor((bd[1]-bWindowGap)/(bWindowWidth+bWindowGap))
    //vertWindowCount = floor((bd[2]-doorHeight-bWindowGap)/(bWindowWidth+bWindowGap))
    
    //horiSideGap = (bd[1]-(horiWindowCount*(bWindowWidth+bWindowGap))+bWindowGap)/2
  
    wData = calcWindowData(bd[1],bd[2])
    horiWindowCount = wData[0]
    vertWindowCount = wData[1]
    horiSideGap = wData[2]
    
    
    for (x=0;x<horiWindowCount;x++){
      for (y=0;y<vertWindowCount;y++){
        
        xloc = bd[0]+horiSideGap+(x*(bWindowWidth+bWindowGap))
        yloc = buildYloc+bWindowGap+(y*(bWindowWidth+bWindowGap))
        fill(color(bd[3][0]-50,bd[3][1]-50,bd[3][2]-50))
        rect(xloc, yloc, bWindowWidth, bWindowWidth)
        
        
      }
    }
    
    return buildingWidth
  }
  
  function calcWindowData(houseWidth, houseHeight){
    horiWindowCount = floor((houseWidth-bWindowGap)/(bWindowWidth+bWindowGap))
    vertWindowCount = floor((houseHeight-doorHeight-bWindowGap)/(bWindowWidth+bWindowGap))
    
    horiSideGap = (houseWidth-(horiWindowCount*(bWindowWidth+bWindowGap))+bWindowGap)/2
    
    return [horiWindowCount,vertWindowCount,horiSideGap]
  }
  
  function drawAllBuildings(){
    for(i=0;i<buildingData.length;i++){
      drawBuilding(buildingData[i])
    }
  }
  
  function drawTerrainBase(h, c){
    fill(c)
    rect(0, height-h, width, h)
  }
  
  function generateColors(){  
    //Color Gen
    bgCols = [random(200, 255),random(200, 255),random(200, 255)]
    bgCol = color(bgCols)
  
    h1Height = random((height*(1/3)), (height))
    
    //h1Height = random(700, 1000)
    h1Cols = generateProximalColor(bgCols,30, 50, true)
    hill1Col = color(h1Cols)
    
    h2Height = random((h1Height-((height-h1Height)*(1/50)), (h1Height-((height-h1Height)*(1/30)))))
    //h2Height = random(h1Height-5, h1Height-10)
    h2Cols = generateProximalColor(h1Cols,30, 50, true)
    hill2Col = color(h2Cols)
    
    h3Height = random((h2Height-((height-h2Height)*(1/50)), ((height-h2Height)-(height*(1/30)))))
    h3Cols = generateProximalColor(h2Cols,30, 50, true)
    hill3Col = color(h3Cols)
    
    buildingAnchorCol = generateProximalColor(h3Cols, 100, 60)
    
    terrainCol = generateProximalColor(h3Cols,30, 50, true)
    
    
    treeLeafColor = generateProximalColor(buildingAnchorCol,80, 120)
    treeBranchColor = generateProximalColor(treeLeafColor,30, 80,true)
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
    
    //minTreeHeight = random((height*(1/40)), (height*(1/20)))
    //maxTreeHeight = random(minTreeHeight+(height*(1/40)), maxTreeHeight+(height*(1/10)))
    maxTreeHeight = random(30,79)
    minTreeHeight = random(maxTreeHeight*.5,maxTreeHeight*.7)
    minBranches = int(random(2,6))
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
    //bCol = generateProximalColor(buildingAnchorCol,0,30)
    console.log("Starting building data generation")
    for (i=0; i<width; i++){
      //console.log("i:")
      //console.log(i)
      
      //bCol = generateProximalColor(buildingAnchorCol,0,30)
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
    /*
    
    let minTreeX = 0
    let minTreeHeight = 0
    let maxTreeHeight = 0
    let minBranches = 0
    let maxBrances = 0
    let minTreeGap = 0
    let maxTreeGap = 0
    */
    
    for (i=0; i<width; i++){
      //console.log("i:")
      //console.log(i)
      
      val = noise(i+1000)   
      genTree= false
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
        generationLoc = i
        branches = []
        leaves = []
        treeHeight = random(minTreeHeight,maxTreeHeight)
        branchCount = int(random(minBranches, maxBranches))
        treeBaseYLoc = height-terrainHeight
        treeTopYLoc = height-terrainHeight-treeHeight

        branchYOffsetRatio = random(minYOffSetRatio, maxYOffSetRatio)
        //Main stem
        append(branches,[i, treeBaseYLoc,i, treeTopYLoc,5])
        append(leaves,[i, height-terrainHeight-treeHeight,treeHeight/3])
        //Sub branches
        branchMinRoot = treeBaseYLoc-(treeHeight*.2)
        maxBranchXLength = (treeHeight*.6)
        prevBranchLeft = false
        for(q=0;q<branchCount;q++){
          gapToTop = treeTopYLoc-branchMinRoot
          root = random(branchMinRoot,branchMinRoot+(gapToTop/2))
          branchXLength = random(maxBranchXLength/2, maxBranchXLength)
          branchY = abs(branchXLength)*branchYOffsetRatio
          if(!prevBranchLeft){
            branchXLength=-branchXLength
          }
          prevBranchLeft=!prevBranchLeft    
          
          append(branches,[i, root,i+branchXLength, root+branchY ,3])
          append(leaves,[i+(branchXLength*.7), root+(branchY*.7),branchXLength*.8])
          maxBranchXLength=branchXLength
          branchMinRoot=root
        }

        td = [branches,leaves]
        append(treeData,td)
        
        
      }
    }
    
    //console.log("All building data generated")
  }
  
  function drawTree(td){ 
    
    //Draw branches
    for(i = 0; i<td[0].length;i++){
      stroke(treeBranchColor)
      strokeWeight(td[0][i][4])
      line(td[0][i][0],td[0][i][1],td[0][i][2],td[0][i][3])
    }
    //Draw Leaves
    for(j = 0; j<td[1].length;j++){
      noStroke()
      fill(treeLeafColor)
      circle(td[1][j][0],td[1][j][1],td[1][j][2])
    }  
  }
  
  function generateSnowPileDataForBuilding(bd){
    //Updating snow height map
    bx1 = bd[0]
    bWidth = bd[1]
    bHeight = bd[2]
    
    
    by1=(bHeight+terrainHeight)
    bx2=bx1+bWidth
    by2=terrainHeight
    
    //Roof snow piles
    
    for(k=bx1;k<(bx1+bWidth);k++){ 
      
      if(!(k>prevBuilding[0]&&k<prevBuilding[2]&&by1<prevBuilding[1]&&by1>prevBuilding[3])){
        
        append(snowPilePositions,[k,by1,0,5])
      }
    }
  
    wData = calcWindowData(bd[1],bd[2])
    horiWindowCount = wData[0]
    vertWindowCount = wData[1]
    horiSideGap = wData[2]
  
  
    for (x=0;x<horiWindowCount;x++){
      for (y=0;y<vertWindowCount;y++){
        for(w=0;w<bWindowWidth;w++){
          
          xLoc=bx1+horiSideGap+(x*(bWindowWidth+bWindowGap))+w
          yLoc = by1-bWindowGap-(y*(bWindowWidth+bWindowGap))-bWindowWidth
          if(!(xLoc>prevBuilding[0]&&xLoc<prevBuilding[2]&&yLoc<prevBuilding[1]&&yLoc>prevBuilding[3])){
            append(snowPilePositions,[xLoc,yLoc,0, 4])
          }
          
        }
      }
  
    }
    
    prevBuilding = [bx1,by1,bx2,by2]
  }
  
  function generateProximalColor(col, minDist, maxDistPerVal, darkerOnly = false, lighterOnly = false){
    //console.log("Generating proximal color")
    generated = false
    returnVal = []
    loopBreak = 0
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
      
      s= 0
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
  
    let noiseScale = 0.006;
    for (let x = 0; x < width; x += 1) {
      // Scale input coordinates.
      let nx = noiseScale * x;
      let nt = noiseScale * seed;
      // Compute noise value.
      let y = h * noise(nx, nt);
      // Render.
      stroke(col)
      line(x, height, x, height-y);
    }
  }
  
  function initialiseSnowLocations(){
    //console.log("Generating snow locations ")
    newLocs = []
    sideLocs = []
    allAdditions=[]
    for (i=0; i<width;i++){
      if((noise((i*snowNoiseScale),(frameCount*snowNoiseScale))<snowDensity)&&(random(0,1)<snowDensityModifier)){
        append(newLocs, [i,0])
      }
    }
    if(currWind>0){
      for (y=0; y<height-terrainHeight;y++){
        if((noise((y*snowNoiseScale),(frameCount*snowNoiseScale))<snowDensity)&&(random(0,1)<snowDensityModifier)){
          append(sideLocs, [0,y])
        }
      }
      //snowLocations = concat(snowLocations, sideLocs)
    }
    else if(currWind<0){
      for (y=0; y<height-terrainHeight;y++){
        if((noise((y*snowNoiseScale),(frameCount*snowNoiseScale))<snowDensity)&&(random(0,1)<snowDensityModifier)){
          append(sideLocs, [width,y])
        }
      }
      //snowLocations = concat(snowLocations, sideLocs)
    }
    allAdditions=concat(sideLocs, newLocs)
    snowLocations = concat(snowLocations, allAdditions)
  }
  
  function generateSunCharacteristics(skyCol){
    sunColor = [random(200, 255),random(200, 255),random(200, 255)]
    sunSize = random(width/20, width/6)
    sunLocation = [random(width/7, width-width/7),random(0, height/2)]
  }
  
  function drawSun(c, s, loc){
    noStroke()
    fill(c)
    circle(loc[0],loc[1], s)
  }
  