var isDrawing = false;
        var pencilActive = false;
        var eraserActive = false;

$(document).ready(function () {
  var isDropOnToolBox = false;
  var currentDrag;
  var grpCounter = 0;
  var currentGrpCounter = 0;
  var _currentGrpCounter = 0;
  var grpHit = false;
  var isSelectedTool = "";
  var deg = 0;
  var currentDragGrpId = 0;
  var currentDropGrpId = 0;
  var currentActStatus = "";
  var currentObj;

  var elementRefArr = [];

  var currenthasGrp;
  var newHtOfRotateGrp = 0;
  var oldHtOfRotateGrp = 0;

  var isFresh = true;

  // NEW: Variables for Copy/Paste functionality
  var copiedCubeData = null;
  var copiedIsLocked = false;

  //value set hitConnector up and down
  var hitConnector = "";
  var isGrpHover = "";
  
  // Track locked cubes
  var lockedCubes = new Set();
  var currentRightClickedCube = null;
  // 
var undoreStack = [];
var redoreStack = [];
var maxUndoreSteps = 150;
// NEW: Variables for Group Count functionality
var isGroupCountActive = false;
var groupCountDisplays = new Map(); // Store count displays by group ID




  $("#undo").addClass("disabled");

  $("#eraser").css({ opacity: "0.6" });
  var isDraggable = false;
  var connectorHt = $(".connector").outerHeight();
  var per = 0;
  var _cX;
  var totalGrpOnStage = 0;

  $("body").prepend(
    '<canvas id="canvas" style="position:absolute; z-index:9999" width=' +
      window.innerWidth +
      " height=" +
      window.innerHeight +
      "></canvas>"
  );

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  //Variables
  var canvasx = $(canvas).offset().left;
  var canvasy = $(canvas).offset().top;
  var last_mousex = (last_mousey = 0);
  var mousex = (mousey = 0);
  var mousedown = false;
  var tooltype = "draw";

  // Initialize cube menu functionality
  initCubeMenu();

  addEvents();

  $(".clickableInfo")
    .unbind("click")
    .bind("click", function () {
      if ($("#info").hasClass("infoClicked") == false) {
        $("#infopopup").show();
        if (/Android|webOS|iPhone|iPod|Opera Mini/i.test(navigator.userAgent)) {
          $("#infopopup").css("transform-origin", "0% 0%");
          $("#infopopup").css(
            "transform",
            "matrix(" + 0.5 + ", 0, 0, " + 0.5 + ", " + 155 + ", " + 108 + ")"
          );
        }
        $("#info").addClass("infoClicked");
      } else if ($("#info").hasClass("infoClicked")) {
        $("#infopopup").hide();
        $("#info").removeClass("infoClicked");
      }
    });

  var uagent = navigator.userAgent.toLowerCase();
  var evt = "click";
  var isweb = false;
  var isNative = "desktop";
  var book_base_path = "books/";

  jQuery.browser = {};
  jQuery.browser.mozilla =
    /mozilla/.test(navigator.userAgent.toLowerCase()) &&
    !/webkit/.test(navigator.userAgent.toLowerCase());
  jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
  jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
  jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
  jQuery.browser.win = window.navigator.platform.indexOf("Win") > -1;
  if (
    navigator.userAgent.indexOf("Safari") != -1 &&
    navigator.userAgent.indexOf("Chrome") == -1
  ) {
    jQuery.browser.safari = true;
  } else {
    jQuery.browser.safari = false;
  }

  $(window).on("orientationchange", function (event) {});

  $('[acc-id="act-container"]').css({
    height: window.innerHeight,
  });
  
  // Enhanced draggable initialization with lock check
function initCubeDraggable() {
    $(".cubes").draggable({
        containment: $(".drop-container"),
        helper: "clone",
        revert: function (isValidDrop) {
            if (!isValidDrop) {
                //if dropped somewhere else...
            }
        },
        start: function (event, ui) {

            // FIXED: Only check lock status for cubes that are already in drop-container
            // Tool-container cubes should always be draggable
            var isFromToolContainer = $(this).closest('.tool-container').length > 0;
            
            if (!isFromToolContainer && isCubeLocked($(this))) {
                return false;
            }
            
            $(".cubes-clone").off("hover");
            $(this).addClass("enabled");
            $(this).removeClass("disabled");
            $(".drop-box-container").removeClass("addcursor");
            showHideSeparateRotateToolInGrp(true);
            showHideSeparateRotateToolInGrp(true);
            currentDrag = ui.helper.clone(true);
            grpHit = false;
            newHtOfRotateGrp = 0;

            $(".drop-container")
                .find(".grpCont")
                .each(function () {
                    // $(this).css({"z-index":0});
                });

            $(currentDrag).css({ "z-index": 2 });

            generateHoverHelpers();
            resetTools();
        },
        drag: function (event, ui) {
            isDraggable = true;
            currentDrag = ui.helper.clone(true);
        },
        stop: function () {
            removeHoverHelpers();
        },
    });
}
  
  initCubeDraggable();

  $(".tool-container").droppable({
    accept: function (dropped) {
      return true;
    },
    drop: function (event, ui) {
      if (ui.draggable.hasClass("grpCont")) {
        $(ui.draggable).remove();
      }
      isDropOnToolBox = true;
      var dragged = ui.helper.clone(true);
      console.log("id.. ", $(dragged)[0]);
    },
  });

$(".drop-box-container").droppable({
    accept: function (dropped) {
        return true;
    },
    drop: function (event, ui) {

        var cX = event.clientX;

        if (cX > window.innerWidth - ($(".tool-container").width() + 20)) {
            removeHoverHelpers();
            $(".rotategrp").each(function (index) {
                $(this).show();
            });

            isDropOnToolBox = true;
        }

        if (isDropOnToolBox) {
            isDraggable = false;
            isDropOnToolBox = false;
            return true;
        }
        
        $("#undo").removeClass("disabled");
        $("#undo").addClass("enabled");

        if (isSelectedTool != "eraser") {
        }

        showHideSeparateRotateToolInGrp(true);

        setTimeout(function () {
            isDraggable = false;
        }, 200);

        $("#" + currentDragGrpId).css({ height: "0px" });

        //if grpHit is false means its normally dropped
        if (!grpHit) {
            //if group dropped only itself or we can say  .drop-box-container
            if (ui.draggable.hasClass("grpCont")) {
                currentActStatus = "grpmove";
                currentObj = $("#grp" + currentDragGrpId);
                currentGrpCounter = $(ui.draggable).attr("id").split("grpCont")[1];
                return true;
            }

            var droppedOn = $(this);
            var dragged = ui.helper.clone(true);
            $(droppedOn).append(dragged);
            grpCounter = grpCounter + 1;
            
            var str =
                '<div  style="position:absolute;  display:inline-block; border:0px solid red; " class="grpCont topGrp" rotateval="0" id="grpCont' +
                grpCounter +
                '"><div class="hasGroup" rotateVal="0" id="grp' +
                grpCounter +
                '" style="position:relative; display:block;  border:0px solid green;"><div class="rotategrp clickable" id="rotategrp1"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp2"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp3"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp4"><img src="assets/images/rotategroup.png"/></div></div></div>';
            
            var dragObj = $(dragged).offset();

            $(droppedOn).parent().prepend(str);

            $("#grp" + grpCounter).css({
                width: $(dragged).width() + "px",
            });

            $("#grpCont" + grpCounter).css({
                top: dragObj.top + "px",
            });
            $("#grpCont" + grpCounter).css({
                left: dragObj.left + "px",
            });
            $("#grpCont" + grpCounter).css({
                width: $(dragged).width() + "px",
            });

            $("#grp" + grpCounter).css({ "z-index": 2 });
            $(dragged)
                .detach()
                .appendTo($("#grp" + grpCounter));

            $(dragged).css({
                top: 0 + "px",
            });
            $(dragged).css({
                left: 0 + "px",
            });
            $(dragged).css({
                margin: 0 + "px",
            });
            $(dragged).css({
                "z-index": 0,
            });
            $(dragged)
                .removeClass("ui-draggable ui-draggable-dragging")
                .attr("acc-id", "cubes-clone");
            $(dragged).removeClass("cubes");
            $(dragged).addClass("cubes-clone");
            $(dragged).addClass("clickable");
            $(dragged).css({
                position: "absolute;",
            });
            $(dragged).css({
                display: "block",
            });
            
            // FIXED: Generate completely new unique IDs for the dropped cube
            var newTempId = "cube" + Date.now() + Math.floor(Math.random() * 1000);
            var newCubeId = "cube" + Date.now() + Math.floor(Math.random() * 1000);
            
            $(dragged).attr("id", newCubeId);
            $(dragged).attr("tempid", newTempId);
            $(dragged).attr("newcubesid", 1);

            // FIXED: Ensure new cube starts completely fresh - remove any lock traces
            $(dragged).removeClass("cube-locked");
            $(dragged).css("opacity", "1");
            
            // Remove from locked sets if somehow it got there
            lockedCubes.delete(newTempId);
            
            // Initialize duplicated cube with proper event handlers
            initCubeEvents($(dragged));

            $("#grp" + grpCounter)
                .find(".spearateCubes")
                .css({
                    display: "block",
                });

            $("#grpCont" + grpCounter).css({ "z-index": 0 });
            var arrZIndex = [];
            $(".drop-container")
                .find(".grpCont")
                .each(function () {
                    arrZIndex.push($(this).css("z-index"));
                });

            arrZIndex.sort(function (a, b) {
                return b - a;
            });

            $("#grpCont" + grpCounter).css({ "z-index": Number(arrZIndex[0]) + 1 });

            currentDrag = "";

            currentActStatus = "normalDrop";
            currentObj = $("#grp" + grpCounter);
            currentGrpCounter = grpCounter;

            $("#grp" + currentGrpCounter)
                .find(".uppercont, .downcont")
                .each(function (index) {
                    $(this).attr("newcubesid", 1);
                    $(this).addClass("enable");
                });
        } else {
            // ... rest of your existing drop code for group attachments
            // This ensures that when attaching to groups, new cubes also start unlocked
            var droppedOn = $(this);
            
            if (ui.draggable.hasClass("grpCont")) {
                $(ui.draggable).find(".connector").css({
                    display: "none",
                });
                $(ui.draggable)
                    .find(".rotategrp")
                    .each(function (index) {
                        $(this).remove();
                    });
                var dragged = ui.draggable.find(".hasGroup").children();

                currentActStatus = "grpDrop";
                currentObj = $(dragged);

                var draggedHt = 0;
                var totalCubes = 0;
                var totalConnectorHt = 0;
                var oneCubeHt = 0;
                $(ui.draggable)
                    .find(".cubes-clone")
                    .each(function (index) {
                        totalCubes = totalCubes + 1;
                        totalConnectorHt = totalConnectorHt + Math.abs(connectorHt);
                        oneCubeHt = $(this).height();
                    });
                draggedHt = Number(oneCubeHt * totalCubes) - totalConnectorHt;
            } else {
                var dragged = ui.helper.clone(true);
                $(dragged).css({
                    display: "block",
                });

                currentActStatus = "normalDrop";
                currentObj = $(dragged);
                draggedHt = $("#cube1").height() - connectorHt;
                
                // FIXED: Ensure newly attached cubes also start unlocked
                $(dragged).removeClass("cube-locked");
                $(dragged).css("opacity", "1");
            }

        var totalCubes = 0;
        var object1 = document.getElementById("grpCont" + currentGrpCounter);
        var lastGrpPos = object1.getBoundingClientRect();

        //first i add it in .drop-box-container
        $(this).append(dragged);
        console.log("now hitConnector  value ", hitConnector);
        if (hitConnector == "up") {
          if (ui.draggable.hasClass("grpCont") == false) {
            $(dragged).addClass("cubes-clone");
          } else {
            $(dragged)
              .removeClass("ui-draggable ui-draggable-dragging cubes")
              .attr("acc-id", "cubes-clone");
          }

          $(dragged)
            .detach()
            .prependTo($("#grp" + currentGrpCounter));
          console.log(
            currentGrpCounter,
            "  add it pleaseeee  ",
            $("#grp" + currentGrpCounter).length,
            "  ",
            $(dragged)[0]
          );

          var totalCubes = 0;

          $(dragged).css({
            top: 0 + "px",
            left: 0 + "px",
            margin: 0 + "px",
            position: "absolute",
          });

          $("#grp" + currentGrpCounter)
            .find(".rotategrp")
            .each(function (index) {
              $(this).remove();
            });

          $("#grp" + currentGrpCounter)
            .find(".cubes-clone")
            .each(function (index) {
              $(this).css({
                top:
                  parseInt($(this).prev().css("top")) +
                  parseInt($(this).prev().height() - connectorHt) +
                  "px",
              });
            });

          if (
            parseInt($("#grpCont" + currentGrpCounter).attr("rotateval")) ==
              0 ||
            parseInt($("#grpCont" + currentGrpCounter).attr("rotateval")) == 360
          ) {
            var newTop = $("#grpCont" + currentGrpCounter).offset().top;
            $("#grpCont" + currentGrpCounter).css({
              top: newTop - parseInt(draggedHt) + "px",
            });
          }

          if (ui.draggable.hasClass("grpCont") == false) {
            $(dragged).addClass("cubes-clone");
          } else {
            $(dragged)
              .removeClass("ui-draggable ui-draggable-dragging cubes")
              .attr("acc-id", "cubes-clone");
          }

          $(dragged).css({
            position: "absolute",
          });

          setCubesPosition();

          var totalCubes = 0;
          var totalConnectorHt = 0;
          var oneCubeHt = 0;
          $("#grp" + currentGrpCounter)
            .find(".cubes-clone")
            .each(function (index) {
              totalCubes = totalCubes + 1;
              totalConnectorHt = totalConnectorHt + Math.abs(connectorHt);
              oneCubeHt = $(this).height();
            });

          $("#grp" + currentGrpCounter)
            .find(".spearateCubes")
            .css({
              display: "block",
            });
        } else if (hitConnector == "down") {
          if (ui.draggable.hasClass("grpCont") == false) {
            $(dragged).addClass("cubes-clone");
          } else {
            $(dragged)
              .removeClass("ui-draggable ui-draggable-dragging cubes")
              .attr("acc-id", "cubes-clone");
          }

          $(dragged)
            .detach()
            .appendTo($("#grp" + currentGrpCounter));
          $("#grp" + currentGrpCounter)
            .find(".rotategrp")
            .each(function (index) {
              $(this).remove();
            });

          $(dragged).css({
            top: 0 + "px",
            left: 0 + "px",
            margin: 0 + "px",
            position: "absolute",
          });

          $("#grp" + currentGrpCounter)
            .find(".cubes-clone")
            .each(function (index) {
              $(this).css({
                top:
                  parseInt($(this).prev().css("top")) +
                  parseInt($(this).prev().height() - connectorHt) +
                  "px",
              });
            });

          setCubesPosition();
        }

        $("#grp" + currentGrpCounter)
          .find(".rotategrp")
          .each(function (index) {
            $(this).remove();
          });

        var rotateStr =
          '<div class="rotategrp clickable" id="rotategrp1"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp2"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp3"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp4"><img src="assets/images/rotategroup.png"/></div>';

        $("#grp" + currentGrpCounter).prepend(rotateStr);
        var rotateGrpDiv = $("#grp" + currentGrpCounter).find("#rotategrp4");

        console.log(
          " ---next---  ",
          $(rotateGrpDiv).next().find("newcubesid")[0]
        );

        $("#grp" + currentGrpCounter)
          .find("#rotategrp1")
          .css({ top: -19 + "px" });
        $("#grp" + currentGrpCounter)
          .find("#rotategrp4")
          .css({ top: -19 + "px" });
      }

      if (newHtOfRotateGrp > 0) {
        $("#grpCont" + currentGrpCounter)
          .find("#rotategrp2")
          .css({ top: newHtOfRotateGrp + "px" });
        $("#grpCont" + currentGrpCounter)
          .find("#rotategrp3")
          .css({ top: newHtOfRotateGrp + "px" });
      }

      makeGroupDraggable();

      $(".rotategrp").hover(
        function () {
          if ($(".grpCont").hasClass("ui-draggable")) {
            $(".grpCont").draggable("disable");
          }
        },
        function () {
          if ($(".grpCont").hasClass("ui-draggable")) {
            $(".grpCont").draggable("enable");
          }
        }
      );

      $(".cubes-clone").hover(
        function () {
          if (isSelectedTool == "eraser") {
            $(".cubes-clone").addClass("addcursor");
          }
        },
        function () {
          $(".cubes-clone").removeClass("addcursor");
        }
      );

      $(".hasGroup")
        .find(".spearateCubes")
        .hover(
          function () {
            if (isSelectedTool == "eraser") {
              return;
            }
            var hoverCurrentGrpCounter = $(this)
              .parent()
              .parent()
              .attr("id")
              .split("grp")[1];
            var currentGrpCubeCount = 0;
            $($("#grp" + hoverCurrentGrpCounter).find(".cubes-clone")).each(
              function (index) {
                if ($(this).is(":visible")) {
                  currentGrpCubeCount = currentGrpCubeCount + 1;
                }
              }
            );

            if (currentGrpCubeCount > 1) {
              if ($(this).parent().attr("newcubesid") != currentGrpCubeCount) {
                $(this).css({
                  opacity: 1,
                });
              }
            }
          },
          function () {
            $(this).css({
              opacity: 0,
            });
          }
        );

      addEvents();
      setTimeout(function() {
            if (isGroupCountActive) {
                if (currentGrpCounter) {
                    var groupContainer = $("#grpCont" + currentGrpCounter);
                    if (groupContainer.length) {
                        updateGroupCount(groupContainer);
                    }
                }
            }
        }, 100);
              // Add this at the end of the drop event, before the closing });
setTimeout(function() {
    undoreSaveState();
}, 100);

 resetTools();
    },
    
  });
// sssfdfdfdsfd
  function addEvents() {
    //for window or mac browser
    {
      $(".hover-helper").on("mouseenter mousemove", function (e) {
        var dragId = $("[hover-helper='" + this.id + "']")
          .parents(".grpCont")
          .attr("id");
        currentGrpCounter = dragId.split("grpCont")[1];
        console.log("add event " + currentGrpCounter);
        grpHit = true;
        if ($("[hover-helper='" + this.id + "']").hasClass("uppercont")) {
          hitConnector = "up";
          $("[hover-helper='" + this.id + "']").css({
            opacity: "1",
          });
        } else if ($("[hover-helper='" + this.id + "']").hasClass("downcont")) {
          hitConnector = "down";
          $("[hover-helper='" + this.id + "']").css({
            opacity: "1",
          });
        }
      });

      $(".hover-helper").on("mouseleave", function (e) {
        setTimeout(function () {
          grpHit = false;
           hitConnector = "";
          $(".downcont, .uppercont").each(function () {
            $(this).css({ opacity: "0" });
          });
        }, 200);
      });
    }

    $("#infopopup").hide();
    $("#info").removeClass("infoClicked");

    $(".clickable")
      .unbind("click")
      .bind("click", function () {
        //resetTools();
        // Check if cube is locked and prevent color changes
        if ($(this).hasClass("cubes-clone") && isCubeLocked($(this))) {
          // If cube is locked and this is a color change attempt, prevent it
          if (isSelectedTool == "" && !$(this).hasClass("rotategrp")) {
            return;
          }
        }
        
        $(".clickable").css({ "pointer-events": "none" });
        setTimeout(function () {
          $(".clickable").css({ "pointer-events": "auto" });
        }, 200);

        if (isDraggable) {
          return;
        }
        if ($(this).hasClass("cubes-clone")) {
          currentGrpCounter = $(this).parent().attr("id").split("grp")[1];

          //when we click cubes using eraser tool to delete it..
          if (isSelectedTool == "eraser") {
            var totalCubes = 0;
            var object1 = document.getElementById(
              "grpCont" + currentGrpCounter
            );
            var lastGrpPos = object1.getBoundingClientRect();

            $(this)
              .parents(".grpCont")
              .find(".cubes-clone")
              .each(function (index) {
                totalCubes = totalCubes + 1;
              });

            currentActStatus = "eraseDrop";
            currentObj = $(this);
            console.log("ccccccc ", currentGrpCounter);
            $("#grpCont" + currentGrpCounter)
              .find(".rotategrp")
              .each(function (index) {
                $(this).remove();
              });

            var cubeId = $(this).attr("newcubesid");
            $(this)
              .parents(".grpCont")
              .find(".cubes-clone")
              .each(function (index) {
                $(this).css({ top: "0px" });
              });

            if (totalCubes <= 1) {
              $(this).parents(".grpCont").remove();
            } else {
              $(this).remove();
            }

            $("#grp" + currentGrpCounter)
              .find(".cubes-clone")
              .each(function (index) {
                if (index > 0) {
                  $(this).css({
                    top:
                      parseInt($(this).prev().css("top")) +
                      parseInt($(this).prev().height() - connectorHt) +
                      "px",
                  });
                }
              });

            setCubesPosition();

            var rotateStr =
              '<div class="rotategrp clickable" id="rotategrp1"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp2"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp3"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp4"><img src="assets/images/rotategroup.png"/></div>';

            $("#grp" + currentGrpCounter).prepend(rotateStr);

            var rotateGrpDiv = $("#grp" + currentGrpCounter).find(
              "#rotategrp1"
            );
            $("#grp" + currentGrpCounter)
              .find("#rotategrp1")
              .css({ top: -19 + "px" });
            $("#grp" + currentGrpCounter)
              .find("#rotategrp4")
              .css({ top: -19 + "px" });

            if (newHtOfRotateGrp > 0) {
              console.log("ht...... ");
              $("#grpCont" + currentGrpCounter)
                .find("#rotategrp2")
                .css({ top: newHtOfRotateGrp + "px" });
              $("#grpCont" + currentGrpCounter)
                .find("#rotategrp3")
                .css({ top: newHtOfRotateGrp + "px" });
            }

            $("#undo").addClass("enabled");
            $("#undo").removeClass("disabled");

            addEvents();
            var zIndex = 0;
            $(
              $("#grp" + currentGrpCounter)
                .find(".cubes-clone")
                .get()
                .reverse()
            ).each(function (index) {
              zIndex = zIndex + 1;
              $(this).css({
                "z-index": zIndex,
              });
            });
          } //separate cubes group or split group into two partsjjdddddg
                   else {
            currentGrpCounter = $(this).parent().attr("id").split("grp")[1];
            var totalCubeFound = 0;
            $($("#grp" + currentGrpCounter).find(".cubes-clone")).each(
              function (index) {
                totalCubeFound = totalCubeFound + 1;
              }
            );
            if (totalCubeFound <= 1) {
              return; // we can not split a single cube so it return without doing any thing
            }
            grpCounter = grpCounter + 1;
            var rotateVal = $("#grp" + currentGrpCounter).attr("rotateVal");
            var str =
              '<div  style="position:absolute; display:inline-block;  border:0px solid red;" rotateVal="' +
              rotateVal +
              '" class="grpCont" id="grpCont' +
              grpCounter +
              '"><div class="hasGroup" rotateVal="' +
              rotateVal +
              '" id="grp' +
              grpCounter +
              '" style="position:relative; display:block; border:0px solid green; "><div class="rotategrp clickable" id="rotategrp1"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp2"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp3"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp4"><img src="assets/images/rotategroup.png"/></div></div></div>';
            $(".drop-container").append(str);

            var _cubeId = $(this).attr("newcubesid");
            $(this).find(".spearateCubes").css({
              opacity: 0,
            });
            var totalCubeInNewGrp = 0;
            var totalConnectorHtNewGrp = 0;
            totalCubes = 0;
            $("#grp" + currentGrpCounter).css({
              transform: "rotate(" + Number(0) + "deg)",
            });
            var oldGrpTop = $("#grp" + currentGrpCounter).offset().top;
            var oldGrpLeft = $("#grp" + currentGrpCounter).offset().left;
            $("#grpCont" + grpCounter).css({ top: oldGrpTop + "px" });
            $("#grpCont" + grpCounter).css({ left: oldGrpLeft + "px" });

            $("#grp" + currentGrpCounter).css({
              transform: "rotate(" + Number(0) + "deg)",
            });

            // FIXED: Track which cubes are being moved to the new group
            var movedCubes = [];
            
            $("#grp" + currentGrpCounter)
              .find(".cubes-clone")
              .each(function (index) {
                if (parseInt($(this).attr("newcubesid")) > parseInt(_cubeId)) {
                  movedCubes.push($(this));
                  $(this)
                    .detach()
                    .appendTo($("#grp" + grpCounter));
                  totalCubeInNewGrp = totalCubeInNewGrp + 1;
                  totalConnectorHtNewGrp =
                    totalConnectorHtNewGrp + Math.abs(connectorHt);
                  $("#grp" + grpCounter).css({ width: "54px" });
                } else {
                  totalCubes = _cubeId;
                  console.log("total cubess Id=====  ", _cubeId);
                }
              });

            // FIXED: Ensure all moved cubes are UNLOCKED in the new group
            movedCubes.forEach(function(cube) {
              // Remove lock classes and restore opacity
              cube.removeClass("cube-locked");
              cube.css("opacity", "1");
              
              // Remove from locked sets
              var tempId = cube.attr("tempid");
              lockedCubes.delete(tempId);
              
              // Generate new unique IDs to avoid any lock association
              var newTempId = "cube" + Date.now() + Math.floor(Math.random() * 1000);
              var newCubeId = "cube" + Date.now() + Math.floor(Math.random() * 1000);
              
              cube.attr("id", newCubeId);
              cube.attr("tempid", newTempId);
            });

            $($("#grp" + currentGrpCounter).find(".cubes-clone")).each(
              function (index) {
                if ($(this).attr("newcubesid") == "1") {
                  $(this).find(".uppercont").addClass("enable");
                  if (totalCubes <= 1) {
                    $(this).find(".downcont").addClass("enable");
                  } else {
                    $(this).find(".downcont").removeClass("enable");
                  }

                  $(this).find(".uppercont").css({
                    display: "block",
                  });
                } else if ($(this).attr("newcubesid") == totalCubes) {
                  $(this).find(".downcont").addClass("enable");
                  $(this).find(".uppercont").removeClass("enable");
                  $(this).find(".downcont").css({
                    display: "block",
                  });
                } else {
                  $(this).find(".downcont").removeClass("enable");
                  $(this).find(".uppercont").removeClass("enable");
                }
              }
            );

            var newId = 0;
            $($("#grp" + grpCounter).find(".cubes-clone")).each(function (
              index
            ) {
              $(this).css({ top: "0px" });
              newId = newId + 1;

              $(this).attr("newcubesid", Number(newId));
            });

            $("#grp" + grpCounter)
              .find(".cubes-clone")
              .each(function (index) {
                $(this).css({
                  top:
                    parseInt($(this).prev().css("top")) +
                    parseInt($(this).prev().height() - connectorHt) +
                    "px",
                });
              });

            totalCubes = newId;
            var clickGrpHt = 0;
            var totalCubes = 0;
            var totalConnectorHt = 0;
            var oneCubeHt = 0;

            $("#grp" + currentGrpCounter)
              .find(".cubes-clone")
              .each(function (index) {
                totalCubes = totalCubes + 1;
                totalConnectorHt = totalConnectorHt + Math.abs(connectorHt);
                oneCubeHt = $(this).height();
              });
            clickGrpHt = Number(oneCubeHt * totalCubes) - totalConnectorHt;
            $("#grp" + currentGrpCounter).css({
              height:
                Number(oneCubeHt * totalCubes) - totalConnectorHt + connectorHt,
            });

            $("#grpCont" + currentGrpCounter)
              .find("#rotategrp2")
              .css({
                top: Number(oneCubeHt * totalCubes) - totalConnectorHt + "px",
              });
            $("#grpCont" + currentGrpCounter)
              .find("#rotategrp3")
              .css({
                top: Number(oneCubeHt * totalCubes) - totalConnectorHt + "px",
              });

            var object1 = document.getElementById("grp" + currentGrpCounter);
            var lastGrpPos = object1.getBoundingClientRect();
            $("#grp" + currentGrpCounter).css({ height: "0px" });
            console.log("last grp Pos ", lastGrpPos);

            var changeTop = 0;
            var changeLeft = 0;
            var deg = $("#grp" + currentGrpCounter).attr("rotateVal");
            if (deg == 0) {
              changeTop = 20;
              changeLeft = 0;
            } else if (deg == 45) {
              changeTop = 20;
              changeLeft = lastGrpPos.bottom;
            } else if (deg == 90) {
              changeTop = -clickGrpHt;
              changeLeft = -(clickGrpHt + 40);
            } else if (deg == 135) {
              changeTop = 0;
              changeLeft = 0;
            } else if (deg == 180) {
              changeTop = -parseInt(clickGrpHt * 2 + 40);
              changeLeft = 0;
            } else if (deg == 225) {
              changeTop = -parseInt(clickGrpHt * 2 + 22);
              changeLeft = 62;
            } else if (deg == 270) {
              changeTop = -parseInt(clickGrpHt);
              changeLeft = parseInt(clickGrpHt + 40);
            } else if (deg == 315) {
              changeTop = 5;
              changeLeft = 53;
            }

            var deg = $("#grp" + currentGrpCounter).attr("rotateVal");
            $("#grp" + currentGrpCounter).css({
              transform: "rotate(" + Number(deg) + "deg)",
            });
            $("#grp" + grpCounter).css({
              transform: "rotate(" + Number(deg) + "deg)",
            });

            if (deg == 45) {
              $("#grpCont" + grpCounter).css({
                top: parseInt(lastGrpPos.top) + lastGrpPos.height + "px",
              });
              $("#grpCont" + grpCounter).css({
                left: lastGrpPos.left - lastGrpPos.height + "px",
              });
            } else if (deg == 135) {
              $("#grpCont" + grpCounter).css({
                top:
                  parseInt(lastGrpPos.top) - parseInt(lastGrpPos.height) + "px",
              });
              $("#grpCont" + grpCounter).css({
                left:
                  parseInt(lastGrpPos.left) -
                  parseInt(lastGrpPos.height) +
                  0 +
                  "px",
              });
            } else if (deg == 225) {
              $("#grpCont" + grpCounter).css({
                top:
                  parseInt(lastGrpPos.top) - parseInt(lastGrpPos.height) + "px",
              });
              $("#grpCont" + grpCounter).css({
                left:
                  parseInt(lastGrpPos.left) +
                  parseInt(lastGrpPos.height) +
                  0 +
                  "px",
              });
            } else if (deg == 315) {
              $("#grpCont" + grpCounter).css({
                top:
                  parseInt(lastGrpPos.top) + parseInt(lastGrpPos.height) + "px",
              });
              $("#grpCont" + grpCounter).css({
                left:
                  parseInt(lastGrpPos.left) +
                  parseInt(lastGrpPos.height) +
                  0 +
                  "px",
              });
            } else {
              $("#grpCont" + grpCounter).css({
                top:
                  parseInt(lastGrpPos.top) +
                  parseInt(clickGrpHt) +
                  parseInt(changeTop) +
                  "px",
              });
              $("#grpCont" + grpCounter).css({
                left: lastGrpPos.left + changeLeft + "px",
              });
            }

            $(".drop-container")
              .find(".hasGroup")
              .each(function (index) {
                if ($(this).find(".cubes-clone").length <= 0) {
                  $(this).remove();
                }
              });
              
            // FIXED: Remove the new group from locked groups if it was added
            lockedGroups.delete("grpCont" + grpCounter);
            
            makeGroupDraggable();

            totalCubes = 0;

            $("#grp" + grpCounter)
              .find(".cubes-clone")
              .each(function (index) {
                totalCubes = totalCubes + 1;
              });

            $("#grp" + grpCounter)
              .find(".cubes-clone")
              .each(function (index) {
                if ($(this).attr("newcubesid") == "1") {
                  console.log("---ssssss---- ", totalCubes);
                  $(this).find(".uppercont").addClass("enable");
                  if (totalCubes <= 1) {
                    $(this).find(".downcont").addClass("enable");
                  } else {
                    $(this).find(".downcont").removeClass("enable");
                  }
                  $(this).find(".uppercont").css({
                    display: "block",
                  });
                } else if ($(this).attr("newcubesid") == totalCubes) {
                  $(this).find(".uppercont").removeClass("enable");
                  $(this).find(".downcont").addClass("enable");
                  $(this).find(".downcont").css({
                    display: "block",
                  });
                } else {
                  $(this).find(".uppercont").removeClass("enable");
                  $(this).find(".downcont").removeClass("enable");
                }
              });
            var rotateGrpDiv = $("#grp" + grpCounter).find("#rotategrp1");
            $("#grpCont" + grpCounter)
              .find("#rotategrp2")
              .css({
                top: parseInt($(rotateGrpDiv).next().css("top")) - 19 + "px",
              });
            console.log("grp counter..ffadafsfsds.. ", grpCounter);
            addEvents();

            console.log(
              "tttt ",
              $("#grp" + currentGrpCounter).css("transform-origin")
            );
            $("#grp" + grpCounter).css({
              "transform-origin": $("#grp" + currentGrpCounter).css(
                "transform-origin"
              ),
            });

            $("#grpCont" + grpCounter)
              .find("#rotategrp2")
              .css({
                top: Number(oneCubeHt+54 * totalCubes) - totalConnectorHt + "px",
              });
            $("#grpCont" + grpCounter)
              .find("#rotategrp3")
              .css({
                top: Number(oneCubeHt+54 * totalCubes) - totalConnectorHt + "px",
              });

            setCubesPosition();
          }
          //end of spearate condition
        } else if ($(this).hasClass("rotategrp")) {
          var totalCubes = 0;
          var totalConnectorHt = 0;
          var oneCubeHt = 0;
          var currentGrp = $(this).parents(".grpCont").find(".hasGroup");

          $(currentGrp)
            .find(".cubes-clone")
            .each(function (index) {
              totalCubes = totalCubes + 1;
              totalConnectorHt = totalConnectorHt + Math.abs(connectorHt);
              oneCubeHt = $(this).height();
            });

          $(currentGrp).css({
            height:
              Number(oneCubeHt * totalCubes) - totalConnectorHt + connectorHt,
          });

          var _ht =
            Number(oneCubeHt * totalCubes) - totalConnectorHt + connectorHt;

          var attId = $(this)
            .parents(".grpCont")
            .attr("id")
            .split("grpCont")[1];

          var object1 = document.getElementById("grp" + attId);
          var lastGrpPos = object1.getBoundingClientRect();

          console.log(lastGrpPos);

          $(this).parent().css({
            "transform-origin-x": "50%",
            "-webkit-transform-origin-x": "50%",
          });
          $(this)
            .parent()
            .css({
              "transform-origin-y": _ht / 2 + "px",
              "-webkit-transform-origin-y": _ht / 2 + "px",
            });

          var deg = $(this).parent().attr("rotateVal");
          $(this)
            .parent()
            .attr("rotateVal", Number(deg) + Number(45));
          $(this)
            .parent()
            .parent()
            .attr("rotateVal", Number(deg) + Number(45));
          deg = $(this).parent().attr("rotateVal");
          $(this)
            .parent()
            .css({
              transform: "rotate(" + Number(deg) + "deg)",
            });
          $(this)
            .parent()
            .find(".connector_helper")
            .css({
              transform: "rotate(" + Number(deg) + "deg)",
            });

          if (deg == 360) {
            $(this).parent().attr("rotateVal", Number(0));
          }

          currenthasGrp = $(this).parent();

          currentActStatus = "rotate";

          $("#grp" + attId).css({ height: "0px" });
 setTimeout(function() {
        var groupContainer = $(this).closest(".grpCont");
        handleRotationForBracket(groupContainer);
    }.bind(this), 100);
 setTimeout(function() {
        undoreSaveState();
    }, 10);
        } else if ($(this).attr("id") == "eraser") {
          $("body").removeAttr("style");
          $("body").removeAttr("class");
       
          isDrawing = false;
              pencilActive = false;
              eraserActive = false;
    $("#draw").css('pointer-events','none')
    
    $("#eraser").removeClass("disabled").addClass("enabled");
    $("#pencilPanel").addClass('hide')
    $("#pencilTool").removeClass("active")
     $("#eraserPanel").addClass('hide')
    $("#eraserTool").removeClass("active")
    $("body").removeClass("addcursor");
    $("body").removeClass("addcursorPencil");
          if (isSelectedTool != "eraser") {
            console.log("eraser selected");
            isSelectedTool = "eraser";
            $(this).removeClass("enabled");
            $(this).addClass("disabled");
            $("#").css({ "pointer-events": "none" });
            $("body").addClass("addcursor");
            $("body").removeClass("addcursorPencil");
            $(this).css({ opacity: 1 });
            $("#pencil").css({ opacity: 0.6 });
            showHideSeparateRotateToolInGrp(false);
          } else {
            isSelectedTool = "";
            $("#").css({ "pointer-events": "auto" });
            $(".cubes-clone").off("hover");
            $(this).addClass("enabled");
            $(this).removeClass("disabled");
            $("body").removeClass("addcursor");
            $("body").removeClass("addcursorPencil");
            showHideSeparateRotateToolInGrp(true);
            $(this).css({ opacity: 0.6 });
             resetTools();
          }
        }
        // dsfsf
  
        
        
        else if ($(this).attr("id") == "undo") {
          isSelectedTool = "";
          $("#undo").removeClass("enabled");
          $("#undo").addClass("disabled");
          $("#eraser").removeClass("enabled");
          $("#eraser").addClass("disabled");
          $(".drop-container").find(".grpCont").remove();
          $(".cubes-clone").removeClass("addcursor");
          $(".drop-box-container").removeClass("addcursor");
          $("#pencil").css({ opacity: "0.6" });
          $(".tempItem").remove();

          $("body").removeClass("addcursor");
          $("body").removeClass("addcursorPencil");
          location.reload();
        }
        
      });
      $("#groupCount").on("click", function() {
        toggleGroupCountDisplay();
    });

// Undo/Redo event handlers - FIX: Ensure immediate responsefrom start here 
$("#undore").off("click").on("click", function(e) {
    e.stopImmediatePropagation(); // FIX: Prevent event bubbling
    e.preventDefault(); // FIX: Prevent default behavior
    
    if (!$(this).hasClass("disabled")) {
        console.log("Undo clicked - performing action");
        undorePerform();
        return false;
    }
});

$("#redore").off("click").on("click", function(e) {
    e.stopImmediatePropagation(); // FIX: Prevent event bubbling
    e.preventDefault(); // FIX: Prevent default behavior
    
    if (!$(this).hasClass("disabled")) {
        console.log("Redo clicked - performing action");
        redorePerform();
        return false;
    }
});

// Keyboard shortcuts for Undo/Redo - FIXED: Prevent double execution
$(document).off("keydown.undore").on("keydown.undore", function(e) {
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.key === 'z' && !e.shiftKey) {
            // Ctrl+Z - Undo
            e.preventDefault();
            e.stopImmediatePropagation();
            if (!$("#undore").hasClass("disabled")) {
                console.log("Ctrl+Z - performing undo");
                undorePerform();
            }
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
            // Ctrl+Y or Ctrl+Shift+Z - Redo
            e.preventDefault();
            e.stopImmediatePropagation();
            if (!$("#redore").hasClass("disabled")) {
                console.log("Ctrl+Y - performing redo");
                redorePerform();
            }
        }
    }
});
undoreUpdateButtonStates()
    }

  // Cube Menu Functionality
  function initCubeMenu() {
    // Hide menu initially
     $("#cubeMenu").hide();
    
    // Context menu for cubes - ONLY for cubes in drop-container
    $(document).on("contextmenu", ".cubes-clone", function(e) {
        e.preventDefault();
        
        // Store the clicked cube
        currentRightClickedCube = $(this);
        
        // Position menu outside .tool-container if needed
        positionCubeMenu(e.pageX, e.pageY);
        $("#cubeMenuMessage").hide();
    $("#cubeMenu .cube-menu-section").show();
    $("#cubeMenu hr").show();
        // Update menu state based on cube lock status
        updateMenuForCube(currentRightClickedCube);
        
        return false;
    });
    $(document).on("contextmenu", ".tool-container .cubes", function(e) {
        return true; // Allow default browser context menu
    });
    // NEW: Context menu for drop container (empty area)
    $(document).on("contextmenu", ".drop-container, .drop-box-container", function(e) {
      if (!$(e.target).closest(".cubes, .cubes-clone, .grpCont").length) {
        e.preventDefault();
        
        currentRightClickedCube = null;
        positionCubeMenu(e.pageX, e.pageY);
        
        // Show only Paste option when right-clicking empty drop container
       $("#cubeMenu button").hide();
        $("#cubeMenu .cube-menu-section").hide();
        $("#cubeMenu hr").hide();
        if (copiedCubeData) {
            $("#cubeMenu button[data-action='paste']").show();
            $("#cubeMenuMessage").hide(); // Hide message
        }
        else {
            // If no copied data, show the message
            $("#cubeMenuMessage").text("You have no copy cube").show();
        }
        
        return false;
      }
    });
    
    // NEW: Keyboard shortcut for paste (Ctrl+V)
    $(document).on("keydown", function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        if (copiedCubeData) {
          pasteCube();
        }
      }
    });
    
    // Hide menu when clicking elsewhere
$(document).on("click", function(e) {
    // Don't hide menu if it's from a touch event on menu items
    if ($(e.target).closest("#cubeMenu").length || e.type === 'touchstart') {
        return;
    }
    $("#cubeMenu").hide();
});
    // Update menu button handlers to work with both click and touch
$("#cubeMenu").on("click touchstart", "button", function(e) {
    e.stopPropagation(); // Prevent event from bubbling to document
    var action = $(this).data("action");
    handleCubeMenuAction(action);
    $("#cubeMenu").hide();
});
// newsssf

  if (isTouchDevice()) {
        initTouchSupport();
    }


  }
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}


var touchStyles = `
<style>
    .menu-shown {
        animation: pulse-glow 0.5s ease-in-out;
        box-shadow: 0 0 20px rgba(0, 150, 255, 0.5);
    }
    
    @keyframes pulse-glow {
        0% { box-shadow: 0 0 5px rgba(0, 150, 255, 0.3); }
        50% { box-shadow: 0 0 25px rgba(0, 150, 255, 0.7); }
        100% { box-shadow: 0 0 20px rgba(0, 150, 255, 0.5); }
    }
    
    /* Make menu more touch-friendly on mobile */
    @media (max-width: 768px) {
        #cubeMenu {
            min-width: 200px;
            font-size: 16px; /* Better touch targets */
        }
        
        #cubeMenu button {
            padding: 12px 16px;
            font-size: 14px;
            text-align: left;
        }
    }
</style>
`;

// Add the styles to the document
$(touchStyles).appendTo('head');
  // Position cube menu properly
  function positionCubeMenu(x, y) {
    var menu = $("#cubeMenu");
    var menuWidth = menu.outerWidth();
    var menuHeight = menu.outerHeight();
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    
    // Check if menu would overlap with tool container
    var toolContainer = $(".tool-container");
    var toolRect = toolContainer[0]?.getBoundingClientRect();
    
    var finalX = x;
    var finalY = y;
    
    // Adjust position if it would overlap with tool container
    if (toolRect && 
        x + menuWidth > toolRect.left && 
        x < toolRect.right &&
        y + menuHeight > toolRect.top && 
        y < toolRect.bottom) {
      // Position to the left of tool container
      finalX = toolRect.left - menuWidth - 10;
      if (finalX < 10) finalX = 10;
    }
    
    // Ensure menu stays within viewport
    if (finalX + menuWidth > windowWidth) {
      finalX = windowWidth - menuWidth - 10;
    }
    if (finalY + menuHeight > windowHeight) {
      finalY = windowHeight - menuHeight - 10;
    }
      if (isTouchDevice()) {
        finalX = Math.max(10, Math.min(finalX, windowWidth - menuWidth - 10));
        finalY = Math.max(10, Math.min(finalY, windowHeight - menuHeight - 10));
    }
    
    menu.css({
      left: finalX + "px",
      top: finalY + "px",
      display: "block"
    });
  }
  
  // Update menu based on cube lock state
  function updateMenuForCube(cube) {
    var isLocked = isCubeLocked(cube);
     var groupContainer = cube.closest(".grpCont");
    var isInGroup = groupContainer.length > 0;
    var cubesInGroup = isInGroup ? groupContainer.find(".cubes-clone").length : 0;
    var showDeleteGroup = isInGroup && cubesInGroup > 1;
    // Show all menu options for cubes
    $("#cubeMenu button").show();
    
    if (isLocked) {
      $("#cubeMenu button[data-action='lock']").hide();
      $("#cubeMenu button[data-action='unlock']").show();
      
      $("#cubeMenu button[data-action='duplicate'], \
#cubeMenu button[data-action='changeColor'], \
#cubeMenu button[data-action='download'], \
#cubeMenu button[data-action='copy']")
.css({
  'opacity': '0.5',
  'pointer-events': 'none'
});


    } else {
      $("#cubeMenu button[data-action='lock']").show();
      $("#cubeMenu button[data-action='unlock']").hide();

      $("#cubeMenu button[data-action='duplicate'], \
#cubeMenu button[data-action='changeColor'], \
#cubeMenu button[data-action='download'], \
#cubeMenu button[data-action='copy']")
.css({'opacity': '1', 'pointer-events': 'auto' });


if (showDeleteGroup) {
            $("#cubeMenu button[data-action='deleteGroup']").show();
        } else {
            $("#cubeMenu button[data-action='deleteGroup']").hide();
        }

    }
    
    // Show paste option only if there's copied data
    if (!copiedCubeData) {
      $("#cubeMenu button[data-action='paste']").hide();
    }
  }
  
  // Check if a cube is lockedisddsd
 function isCubeLocked(cube) {
  if (cube.closest('.tool-container').length > 0) {
        return false;
    }
    var tempId = cube.attr("tempid");
    var isDirectlyLocked = cube.hasClass("cube-locked") || lockedCubes.has(tempId);
    
    if (isDirectlyLocked) return true;
    
    // Check if the cube belongs to a locked group
    var groupContainer = cube.closest(".grpCont");
    if (groupContainer.length) {
        return isGroupLocked(groupContainer);
    }
    
    return false;
}

  
  // Handle menu actions
  function handleCubeMenuAction(action) {
    if (action === "paste") {
      pasteCube();
    } else if (currentRightClickedCube) {
      var cube = currentRightClickedCube;
      
      switch(action) {
        case "lock":
          lockCube(cube);
          break;
        case "unlock":
          unlockCube(cube);
          break;
        case "duplicate":
          duplicateCube(cube);
          break;
        case "rotate":
          rotateCubeViaMenu(cube);
          break;
        case "changeColor":
          if (!isCubeLocked(cube)) {
            changeCubeColor(cube);
          }
          break;
        case "copy":
          copyCube(cube);
          break;
        case "download":
          downloadCubeAsPNG(cube);
          break;
        case "delete":
          deleteCube(cube);
          break;
           case "deleteGroup":
                deleteGroup(cube);
                break;
        case "properties":
          showCubeProperties(cube);
          break;
      }
    }
    
    $("#cubeMenu").hide();
  }
  
  // NEW: Copy cube functionalitycccc
function copyCube(cube) {
    var groupContainer = cube.closest(".grpCont");
    
    if (groupContainer.length) {
        // Copy entire group - BUT don't copy lock status
        copiedCubeData = {
            type: 'group',
            html: groupContainer[0].outerHTML,
            position: groupContainer.offset(),
            // REMOVED: isLocked: isCubeLocked(cube) - Don't copy lock status
            isLocked: false // NEW: Always set to false
        };
    } else {
        // Copy single cube - BUT don't copy lock status
        copiedCubeData = {
            type: 'single',
            html: cube[0].outerHTML,
            position: cube.offset(),
            // REMOVED: isLocked: isCubeLocked(cube) - Don't copy lock status
            isLocked: false // NEW: Always set to false
        };
    }
    
    copiedIsLocked = false; // NEW: Always false for pasted cubes
    // kk
    
    console.log("Cube copied (unlocked):", copiedCubeData.type);
    setTimeout(function() {
        undoreSaveState();
    }, 10);
}
  
  // NEW: Paste cube functionality
function pasteCube() {
    if (!copiedCubeData) {
        showNoCopyMessage();
        return;
    }
    
    grpCounter = grpCounter + 1;
    var newGrpId = grpCounter;
    
    if (copiedCubeData.type === 'group') {
        // Paste entire group
        var newGroup = $(copiedCubeData.html);
        var oldGroupId = newGroup.attr("id");
        newGroup.attr("id", "grpCont" + newGrpId);
        
        // Update all IDs in the group
        newGroup.find("[id]").each(function() {
            var oldId = $(this).attr("id");
            if (oldId && oldId.includes("grp")) {
                $(this).attr("id", oldId.replace(/\d+$/, newGrpId));
            }
        });
        
        // Position near original or at mouse position
        var pastePosition = getPastePosition();
        var groupCount = $(".grpCont").length;
        newGroup.css({
            top: pastePosition.top + "px",
            left: pastePosition.left + (groupCount * 5) + "px"
        });
        
        $(".drop-container").prepend(newGroup);
        
        // FIXED: Ensure all pasted cubes are UNLOCKED
        newGroup.find(".cubes-clone").each(function() {
            var cube = $(this);
            
            // Remove any lock classes and ensure normal opacity
            cube.removeClass("cube-locked");
            cube.css("opacity", "1");
            
            // Generate new unique IDs to avoid any lock association
            var newTempId = "cube" + Date.now() + Math.floor(Math.random() * 1000);
            var newCubeId = "cube" + Date.now() + Math.floor(Math.random() * 1000);
            
            cube.attr("id", newCubeId);
            cube.attr("tempid", newTempId);
            
            // Remove from locked sets
            lockedCubes.delete(newTempId);
            
            initCubeEvents(cube);
            
            // REMOVED: Don't lock pasted cubes even if original was locked
            // if (copiedIsLocked) {
            //     lockCube($(this));
            // }
        });
        
         $("#grp" + newGrpId).find(".spearateCubes").hover(
            function() {
                if (isSelectedTool == "eraser") {
                    return;
                }
                var hoverCurrentGrpCounter = $(this).parent().parent().attr("id").split("grp")[1];
                var currentGrpCubeCount = 0;
                $($("#grp" + hoverCurrentGrpCounter).find(".cubes-clone")).each(function(index) {
                    if ($(this).is(":visible")) {
                        currentGrpCubeCount = currentGrpCubeCount + 1;
                    }
                });

                if (currentGrpCubeCount > 1) {
                    if ($(this).parent().attr("newcubesid") != currentGrpCubeCount) {
                        $(this).css({
                            opacity: 1,
                        });
                    }
                }
            },
            function() {
                $(this).css({
                    opacity: 0,
                });
            }
        );
        // FIXED: Properly initialize connectors for pasted group
        currentGrpCounter = newGrpId;
        setCubesPosition();
        
        makeGroupDraggable();
        addEvents();
        
   
      } else {
        // Paste single cube as new group
        var str = '<div style="position:absolute; display:inline-block; border:0px solid red;" class="grpCont topGrp" rotateval="0" id="grpCont' + 
                  newGrpId + '"><div class="hasGroup" rotateVal="0" id="grp' + 
                  newGrpId + '" style="position:relative; display:block; border:0px solid green;">' +
                  '<div class="rotategrp clickable" id="rotategrp1"><img src="assets/images/rotategroup.png"/></div>' +
                  '<div class="rotategrp clickable" id="rotategrp2"><img src="assets/images/rotategroup.png"/></div>' +
                  '<div class="rotategrp clickable" id="rotategrp3"><img src="assets/images/rotategroup.png"/></div>' +
                  '<div class="rotategrp clickable" id="rotategrp4"><img src="assets/images/rotategroup.png"/></div>' +
                  '</div></div>';
        
        $(".drop-container").prepend(str);
        
        var clonedCube = $(copiedCubeData.html);
        var newTempId = "cube" + (Date.now() + Math.floor(Math.random() * 1000));
        var newCubeId = "cube" + (Date.now() + Math.floor(Math.random() * 1000));
        
        clonedCube.attr("id", newCubeId);
        clonedCube.attr("tempid", newTempId);
        clonedCube.removeClass("ui-draggable ui-draggable-dragging cubes");
        clonedCube.addClass("cubes-clone clickable");
        clonedCube.attr("newcubesid", "1");
        clonedCube.attr("acc-id", "cubes-clone");
        
        clonedCube.css({
            position: "absolute",
            top: "0px",
            left: "0px", 
            margin: "0px",
            display: "block"
        });
        
        // FIXED: Ensure pasted cube is UNLOCKED
        clonedCube.removeClass("cube-locked");
        clonedCube.css("opacity", "1");
        
        $("#grp" + newGrpId).append(clonedCube);
        $("#grp" + newGrpId).css({ width: clonedCube.width() + "px" });
        
        var pastePosition = getPastePosition();
        $("#grpCont" + newGrpId).css({
            top: pastePosition.top + "px",
            left: pastePosition.left + "px"
        });
        
        $("#grp" + newGrpId).find(".spearateCubes").css({ display: "block" });
        
        // FIXED: Don't lock pasted cubes even if original was locked
        // REMOVED: if (copiedIsLocked) { lockCube(clonedCube); }
        
        // FIXED: Ensure connectors are properly initialized for pasted single cube


        currentGrpCounter = newGrpId;
                 $("#grp" + newGrpId).find(".spearateCubes").hover(
            function() {
                if (isSelectedTool == "eraser") {
                    return;
                }
                var hoverCurrentGrpCounter = $(this).parent().parent().attr("id").split("grp")[1];
                var currentGrpCubeCount = 0;
                $($("#grp" + hoverCurrentGrpCounter).find(".cubes-clone")).each(function(index) {
                    if ($(this).is(":visible")) {
                        currentGrpCubeCount = currentGrpCubeCount + 1;
                    }
                });

                if (currentGrpCubeCount > 1) {
                    if ($(this).parent().attr("newcubesid") != currentGrpCubeCount) {
                        $(this).css({
                            opacity: 1,
                        });
                    }
                }
            },
            function() {
                $(this).css({
                    opacity: 0,
                });
            }
        );
        setCubesPosition();
        
        initCubeEvents(clonedCube);
        makeGroupDraggable();
        addEvents();
    }
    setTimeout(function() {
        if (isGroupCountActive) {
            var newGroupContainer = $("#grpCont" + newGrpId);
            if (newGroupContainer.length) {
                updateGroupCount(newGroupContainer);
            }
        }
    }, 100);
    setTimeout(function() {
        undoreSaveState();
    }, 10);
    console.log("Cube pasted as UNLOCKED: grpCont" + newGrpId);
}
  
  // NEW: Get position for pasted cube
  function getPastePosition() {
    var position = { top: 100, left: 100 };
    
    if (currentRightClickedCube) {
      // Position near right-clicked cube
      var originalPos = currentRightClickedCube.closest(".grpCont").offset();
      if (originalPos) {
        position.top = originalPos.top + 40;
        position.left = originalPos.left + 40;
      }
    } else {
      // Position near mouse or in center of drop container
      var dropContainer = $(".drop-container");
      var containerOffset = dropContainer.offset();
      if (containerOffset) {
        position.top = containerOffset.top + 100;
        position.left = containerOffset.left + 100;
      }
    }
    
    return position;
  }
  
  // NEW: Download cube as PNG
// NEW: Download cube as PNG - Fixed versionxxssssss
// FIXED: Enhanced download function for rotated cubes/groups
function downloadCubeAsPNG(cube) {
    var groupContainer = cube.closest(".grpCont");
    var elementToCapture = groupContainer.length ? groupContainer[0] : cube[0];
    
    // Get the rotation value
    var rotation = 0;
    if (groupContainer.length) {
        var hasGroup = groupContainer.find(".hasGroup");
        rotation = parseInt(hasGroup.attr("rotateVal")) || 0;
    }
    
    // Create a temporary container with proper dimensions
    var tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.zIndex = '-9999';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '0px'; // Increased padding for rotation
    
    // Clone the element
    var clone = $(elementToCapture).clone(true)[0];
    
    // Remove transform from clone to calculate actual bounds
    var originalTransform = clone.style.transform;
    clone.style.transform = 'none';
    
    tempContainer.appendChild(clone);
    document.body.appendChild(tempContainer);
    
    // Calculate the actual dimensions needed for rotation
    var rect = clone.getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;
    
    // Calculate expanded dimensions to accommodate rotation
    var expandedSize = Math.max(width, height) * 1.8; // 80% extra space for rotation
    
    // Remove the clone and recreate with proper container
    document.body.removeChild(tempContainer);
    
    // Create new container with calculated dimensions
    var captureContainer = document.createElement('div');
    captureContainer.style.position = 'fixed';
    captureContainer.style.left = '-9999px';
    captureContainer.style.top = '0';
    captureContainer.style.zIndex = '-9999';
    captureContainer.style.backgroundColor = 'transparent';
    captureContainer.style.width = expandedSize + 'px';
    captureContainer.style.height = expandedSize + 'px';
    captureContainer.style.display = 'flex';
    captureContainer.style.alignItems = 'center';
    captureContainer.style.justifyContent = 'center';
    captureContainer.style.padding = '0px';
    
    // Clone the element again
    var finalClone = $(elementToCapture).clone(true)[0];
    captureContainer.appendChild(finalClone);
    document.body.appendChild(captureContainer);
    
    // Configure html2canvas options
    var options = {
        backgroundColor: 'transparent ',
        scale: 1, // Good balance of quality and size
        logging: false,
        useCORS: true,
        removeContainer: true,
        width: captureContainer.scrollWidth,
        height: captureContainer.scrollHeight,
        onclone: function(clonedDoc, element) {
            // Ensure all images are loaded
            var images = element.querySelectorAll('img');
            var loadPromises = [];
            
            images.forEach(function(img) {
                if (!img.complete) {
                    var promise = new Promise(function(resolve) {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                    loadPromises.push(promise);
                }
            });
            
            return Promise.all(loadPromises);
        }
    };
    
    html2canvas(captureContainer, options).then(function(canvas) {
        // Convert canvas to data URL
        var dataURL = canvas.toDataURL("image/png");
        
        // Create download link
        var link = document.createElement('a');
        var groupId = groupContainer.length ? groupContainer.attr("id") : "cube_" + cube.attr("tempid");
        link.download = groupId + '.png';
        link.href = dataURL;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        document.body.removeChild(captureContainer);
        
        console.log("Successfully downloaded:", link.download);
    }).catch(function(error) {
        console.error("Error capturing cube as PNG:", error);
        // Clean up on error
        if (document.body.contains(captureContainer)) {
            document.body.removeChild(captureContainer);
        }
        
        // Fallback: Try simple capture
        try {
            html2canvas(elementToCapture, {
                backgroundColor: 'transparent',
                scale: 1
            }).then(function(canvas) {
                var dataURL = canvas.toDataURL("image/png");
                var link = document.createElement('a');
                var groupId = groupContainer.length ? groupContainer.attr("id") : "cube_" + cube.attr("tempid");
                link.download = groupId + '.png';
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        } catch (fallbackError) {
            console.error("Fallback also failed:", fallbackError);
        }
    });
}
  
  // Lock cube functionalitymmm
 function lockCube(cube) {
  
    var tempId = cube.attr("tempid");
    lockedCubes.add(tempId);
    cube.addClass("cube-locked");
    
    // Lock the entire group
    var groupContainer = cube.closest(".grpCont");
    if (groupContainer.length) {
        var groupId = groupContainer.attr("id");
        lockedGroups.add(groupId);
        
        // Apply opacity to all cubes in the group
        groupContainer.find(".cubes-clone").each(function() {
            var cubeTempId = $(this).attr("tempid");
            lockedCubes.add(cubeTempId);
            $(this).addClass("cube-locked");
            $(this).css("opacity", "0.5");
        });
        
        // Make entire group undraggable
        if (groupContainer.hasClass("ui-draggable")) {
            groupContainer.draggable("disable");
        }
        
        // Disable connectors in the entire group
        groupContainer.find(".uppercont, .downcont").removeClass("enable");
        groupContainer.find(".uppercont, .downcont").css({
            "pointer-events": "none",
            "opacity": "0.2"
        });
        
        console.log("Locked entire group:", groupId);
    } else {
        // Single cube locking (existing behavior)
        if (cube.hasClass("ui-draggable")) {
            cube.draggable("disable");
        }
        cube.css("opacity", "0.5");
    }
       setTimeout(function() {
        undoreSaveState();
    }, 10);
}

// NEW: Unlock entire group functionality
function unlockCube(cube) {
    var tempId = cube.attr("tempid");
    lockedCubes.delete(tempId);
    cube.removeClass("cube-locked");
    
    // Unlock the entire group
    var groupContainer = cube.closest(".grpCont");
    if (groupContainer.length) {
        var groupId = groupContainer.attr("id");
        lockedGroups.delete(groupId);
        
        // Remove opacity from all cubes in the group
        groupContainer.find(".cubes-clone").each(function() {
            var cubeTempId = $(this).attr("tempid");
            lockedCubes.delete(cubeTempId);
            $(this).removeClass("cube-locked");
            $(this).css("opacity", "1");
        });
        
        // Make entire group draggable again
        if (groupContainer.hasClass("ui-draggable")) {
            groupContainer.draggable("enable");
        }
        
        // FIXED: Properly re-enable connectors for the entire group
        reenableGroupConnectors(groupContainer);
        
        console.log("Unlocked entire group:", groupId);
    } else {
        // Single cube unlocking
        if (cube.hasClass("ui-draggable")) {
            cube.draggable("enable");
        }
        cube.css("opacity", "1");
        
        // FIXED: Re-enable connectors for single cube
        reenableSingleCubeConnectors(cube);
    }
     
}
function reenableSingleCubeConnectors(cube) {
    // Reset connector styles
    cube.find(".uppercont, .downcont").css({
        "pointer-events": "auto",
        "opacity": "0"
    });
    
    // Enable both connectors for single cube
    cube.find(".uppercont").addClass("enable");
    cube.find(".uppercont").css("display", "block");
    cube.find(".downcont").addClass("enable");
    cube.find(".downcont").css("display", "block");
}

function reenableGroupConnectors(groupContainer) {
    var groupId = groupContainer.attr("id").replace("grpCont", "");
    var cubes = groupContainer.find(".cubes-clone");
    var totalCubes = cubes.length;
    
    cubes.each(function(index) {
        var cube = $(this);
        var cubeId = cube.attr("newcubesid");
        
        // Reset connector styles
        cube.find(".uppercont, .downcont").css({
            "pointer-events": "auto",
            "opacity": "0"
        });
        
        // Enable appropriate connectors based on position
        if (cubeId == "1") {
            // First cube - enable top connector
            cube.find(".uppercont").addClass("enable");
            cube.find(".uppercont").css("display", "block");
            cube.find(".downcont").removeClass("enable");
        } else if (cubeId == totalCubes) {
            // Last cube - enable bottom connector
            cube.find(".downcont").addClass("enable");
            cube.find(".downcont").css("display", "block");
            cube.find(".uppercont").removeClass("enable");
        } else {
            // Middle cubes - no connectors enabled
            cube.find(".uppercont").removeClass("enable");
            cube.find(".downcont").removeClass("enable");
        }
    });
    
    // Update the current group counter and refresh hover helpers
    currentGrpCounter = groupId;
    setCubesPosition();
}


  function isGroupLocked(groupContainer) {
    var groupId = groupContainer.attr("id");
    
    return lockedGroups.has(groupId);

}



  // Enhanced duplicate functionality - creates new cube in drop container
 function duplicateCube(originalCube) {
    var isOriginalLocked = isCubeLocked(originalCube);
    
    // Get the current maximum group counter and increment
    var currentMax = getCurrentMaxGroupCounter();
    grpCounter = currentMax + 1;
    var newGrpId = grpCounter;
    
    // Create new group container like the existing structure
    var str = '<div style="position:absolute; display:inline-block; border:0px solid red;" class="grpCont topGrp" rotateval="0" id="grpCont' + 
              newGrpId + '"><div class="hasGroup" rotateVal="0" id="grp' + 
              newGrpId + '" style="position:relative; display:block; border:0px solid green;">' +
              '<div class="rotategrp clickable" id="rotategrp1"><img src="assets/images/rotategroup.png"/></div>' +
              '<div class="rotategrp clickable" id="rotategrp2"><img src="assets/images/rotategroup.png"/></div>' +
              '<div class="rotategrp clickable" id="rotategrp3"><img src="assets/images/rotategroup.png"/></div>' +
              '<div class="rotategrp clickable" id="rotategrp4"><img src="assets/images/rotategroup.png"/></div>' +
              '</div></div>';
    
    // Add to drop container
    $(".drop-container").prepend(str);
    
    // Clone the cube but create new unique IDs
    var clonedCube = originalCube.clone(true);
    
    // Generate new unique IDs for the cube
    var newTempId = "cube" + (Date.now() + Math.floor(Math.random() * 1000));
    var newCubeId = "cube" + (Date.now() + Math.floor(Math.random() * 1000));
    
    // Update attributes with new IDs
    clonedCube.attr("id", newCubeId);
    clonedCube.attr("tempid", newTempId);
    clonedCube.removeClass("ui-draggable ui-draggable-dragging cubes");
    clonedCube.addClass("cubes-clone clickable");
    clonedCube.attr("newcubesid", "1");
    clonedCube.attr("acc-id", "cubes-clone");
    
    // Remove any existing position styles
    clonedCube.css({
        position: "absolute",
        top: "0px",
        left: "0px", 
        margin: "0px",
        display: "block"
    });
    
    // Add to the new group
    $("#grp" + newGrpId).append(clonedCube);
    
    // Set group dimensions
    $("#grp" + newGrpId).css({
        width: clonedCube.width() + "px"
    });
    
    // Position the new group near the original but in drop container
    var originalGroup = originalCube.closest(".grpCont");
    if (originalGroup.length) {
        var originalPos = originalGroup.offset();
        var groupCount = $(".grpCont").length;
        $("#grpCont" + newGrpId).css({
            top: (originalPos.top + 40) + "px",
            left: (originalPos.left + 40 + (groupCount * 5)) + "px"
        });
    } else {
        // If original is in tool container, place in a default position in drop container
        $("#grpCont" + newGrpId).css({
            top: "100px",
            left: "100px"
        });
    }
    
    // Initialize the spearate cubes display
    $("#grp" + newGrpId).find(".spearateCubes").css({
        display: "block"
    });
    
    // FIXED: Ensure connectors are properly initialized for duplicated cube
    currentGrpCounter = newGrpId;
    setTimeout(function() {
    setCubesPosition();
    
    // Explicitly enable the bottom connector for the duplicated cube
    var duplicatedCube = $("#grp" + newGrpId).find(".cubes-clone");
    if (duplicatedCube.length) {
        duplicatedCube.find(".downcont").addClass("enable");
        duplicatedCube.find(".downcont").css("display", "block");
    }
}, 100);
    
    if (isOriginalLocked) {
        lockCube(clonedCube);
    }
    
    // Initialize events for the new cube
    initCubeEvents(clonedCube);
    
    // Make the new group draggable
    makeGroupDraggable();
    
    // Add rotation events
    addEvents();
        setTimeout(function() {
        if (isGroupCountActive) {
            var newGroupContainer = $("#grpCont" + newGrpId);
            if (newGroupContainer.length) {
                updateGroupCount(newGroupContainer);
            }
        }
    }, 100);
      setTimeout(function() {
        undoreSaveState();
    }, 10);
    console.log("Duplicated cube created with group: grpCont" + newGrpId);
    return clonedCube;
}
  
  // Rotate cube via menu (integrates with existing rotation)
  function rotateCubeViaMenu(cube) {
    // Find the rotation group this cube belongs to
    var rotationGroup = cube.closest(".hasGroup");
    
    if (rotationGroup.length) {
      // Use existing rotation logic
      var rotateIcons = rotationGroup.find(".rotategrp");
      if (rotateIcons.length) {
        // Trigger click on first rotate icon (45° rotation)
        rotateIcons.first().trigger("click");
      }
    } else {
      // Individual cube rotation logic would go here
      console.log("Rotate individual cube:", cube.attr("tempid"));
    }
   
  }
  
  // Change cube color
  function changeCubeColor(cube) {
    if (isCubeLocked(cube)) {
        console.log("Cannot change color - cube is locked");
        return;
    }
    
    // Your existing color change logic here
    // This would cycle through colors or open a color picker
    console.log("Change color for cube:", cube.attr("tempid"));
    
    // Example color cycling - replace with your actual color change logic
    var currentSrc = cube.find('img').last().attr('src');
    var cubeNumber = currentSrc.match(/cube(\d+)\.png/);
    if (cubeNumber) {
        var currentNum = parseInt(cubeNumber[1]);
        var newNum = currentNum + 1;
        if (newNum > 12) newNum = 1; // Loop back to 1 after 12
        
        var newSrc = currentSrc.replace(/cube\d+\.png/, 'cube' + newNum + '.png');
        cube.find('img').last().attr('src', newSrc);
    }
      setTimeout(function() {
        undoreSaveState();
    }, 10);
  }
  
  // Delete cube functionalityddd
 function deleteCube(cube) {
    var tempId = cube.attr("tempid");
    lockedCubes.delete(tempId);
    
    // Get the group and cube position before removal
    var groupContainer = cube.closest(".grpCont");
    var groupId = groupContainer.attr("id").replace("grpCont", "");
    var cubePosition = parseInt(cube.attr("newcubesid"));
    
    // Remove the cube
    cube.remove();
    
    // Update the current group counter
    currentGrpCounter = groupId;
    
    // FIXED: Recalculate and adjust positions of remaining cubes
    adjustCubePositionsAfterDeletion(groupContainer);
     setTimeout(function() {
        if (isGroupCountActive && groupContainer.length) {
            updateGroupCount(groupContainer);
        }
    }, 100);

     setTimeout(function() {
        undoreSaveState();
    }, 10);
    console.log("Deleted cube:", tempId);
}

function deleteGroup(cube) {
    var groupContainer = cube.closest(".grpCont");
    
    if (!groupContainer.length) {
        console.log("No group found to delete");
        return;
    }
    
    var groupId = groupContainer.attr("id");
    var cubesInGroup = groupContainer.find(".cubes-clone").length;
    
    // Remove all locked cubes from the locked sets
    groupContainer.find(".cubes-clone").each(function() {
        var cubeTempId = $(this).attr("tempid");
        lockedCubes.delete(cubeTempId);
    });
    
    // Remove group from locked groups
    lockedGroups.delete(groupId);
    
    // Remove the entire group container
    groupContainer.remove();
    
    console.log("Deleted group:", groupId, "with", cubesInGroup, "cubes");
    
    // Refresh the UI if needed
    addEvents();
     setTimeout(function() {
        undoreSaveState();
    }, 10);
}


// NEW: Function to adjust cube positions after deletion
function adjustCubePositionsAfterDeletion(groupContainer) {
    var cubes = groupContainer.find(".cubes-clone");
    var totalCubes = cubes.length;
    
    if (totalCubes === 0) {
        // If no cubes left, remove the entire group
        groupContainer.remove();
        return;
    }
    
    // Reset all cube positions and renumber them
    cubes.each(function(index) {
        var cube = $(this);
        var newPosition = index + 1;
        
        // Update the cube position number
        cube.attr("newcubesid", newPosition);
        
        // Reset top position
        if (index === 0) {
            // First cube at position 0
            cube.css("top", "0px");
        } else {
            // Subsequent cubes stack below previous ones
            var prevCube = cubes.eq(index - 1);
            var prevCubeHeight = prevCube.height();
            cube.css("top", (parseInt(prevCube.css("top")) + (prevCubeHeight - connectorHt)) + "px");
        }
    });
    
    // Update connectors and refresh the group
    setCubesPosition();
    
    // Re-add rotation controls if needed
    if (totalCubes > 0) {
        var rotateStr = '<div class="rotategrp clickable" id="rotategrp1"><img src="assets/images/rotategroup.png"/></div>' +
                       '<div class="rotategrp clickable" id="rotategrp2"><img src="assets/images/rotategroup.png"/></div>' +
                       '<div class="rotategrp clickable" id="rotategrp3"><img src="assets/images/rotategroup.png"/></div>' +
                       '<div class="rotategrp clickable" id="rotategrp4"><img src="assets/images/rotategroup.png"/></div>';
        
        groupContainer.find(".hasGroup").prepend(rotateStr);
        
        // Position rotation controls
        groupContainer.find("#rotategrp1").css({ top: -19 + "px" });
        groupContainer.find("#rotategrp4").css({ top: -19 + "px" });
        
        if (newHtOfRotateGrp > 0) {
            groupContainer.find("#rotategrp2").css({ top: newHtOfRotateGrp + "px" });
            groupContainer.find("#rotategrp3").css({ top: newHtOfRotateGrp + "px" });
        }
    }
    
    // Reinitialize events
    addEvents();
    makeGroupDraggable();
}

  
  // Initialize cube events (for duplicated cubes)
  function initCubeEvents(cube) {
    cube.off("click").on("click", function() {
      if (isCubeLocked($(this)) && isSelectedTool == "") {
        return; // Prevent color changes when locked
      }
      
      // Existing click handling logic
      $(".clickable").css({ "pointer-events": "none" });
      setTimeout(function() {
        $(".clickable").css({ "pointer-events": "auto" });
      }, 200);
      
      if (isDraggable) return;
      
      // Continue with existing cube click logic...
    });
    
    // Re-initialize hover events
    cube.hover(
      function() {
        if (isSelectedTool == "eraser") {
          $(this).addClass("addcursor");
        }
      },
      function() {
        $(this).removeClass("addcursor");
      }
    );
  }

  // Function to get current maximum group counter
  function getCurrentMaxGroupCounter() {
    var maxCounter = 0;
    $(".grpCont").each(function() {
        var id = $(this).attr("id");
        if (id && id.startsWith("grpCont")) {
            var counter = parseInt(id.replace("grpCont", ""));
            if (counter > maxCounter) {
                maxCounter = counter;
            }
        }
    });
    return maxCounter;
  }



  // cube properties 

function initCubePropertiesModal() {
    var modal = $("#cubePropertiesModal");
    var closeBtn = $(".close-properties");
    
    // Close modal when clicking X
    closeBtn.on("click", function() {
        modal.hide();
    });
    
    // Close modal when clicking outside
    $(window).on("click", function(event) {
        if (event.target === modal[0]) {
            modal.hide();
        }
    });
    
    // Close modal with Escape key
    $(document).on("keydown", function(e) {
        if (e.key === "Escape" && modal.is(":visible")) {
            modal.hide();
        }
    });
}

// NEW: Show cube properties modal
var currentPropertiesCube = null;

function showCubeProperties(cube) {
    currentPropertiesCube = cube;
    updatePropertiesModal(cube);
    $("#cubePropertiesModal").show();
}

// NEW: Update modal with cube properties
function updatePropertiesModal(cube) {
    if (!cube) return;
    
    // Temporary ID
    $("#propTempId").text(cube.attr("tempid") || "N/A");
    
    // Status - show if it's part of a locked group
    var groupContainer = cube.closest(".grpCont");
    var isLocked = isCubeLocked(cube);
    $("#propLockStatus").text(isLocked ? "🔒 Locked (Group)" : "🔓 Unlocked");
    
    // Rotation
    var rotation = cube.closest(".hasGroup").attr("rotateVal") || "0";
    $("#propRotation").text(rotation + "°");
    
    // Group Information
    if (groupContainer.length) {
        var cubesInGroup = groupContainer.find(".cubes-clone").length;
        $("#propCubesInGroup").text(cubesInGroup);
        
        var cubePosition = cube.attr("newcubesid") || "1";
        $("#propCubePosition").text(cubePosition + " of " + cubesInGroup);
    } else {
        $("#propCubesInGroup").text("1");
        $("#propCubePosition").text("1 of 1");
    }
    
    // Color
    var cubeImage = cube.find('img').last().attr('src') || '';
    var colorMatch = cubeImage.match(/cube(\d+)\.png/);
    var colorNumber = colorMatch ? colorMatch[1] : "Unknown";
    $("#propColor").text("Color " + colorNumber);
    
    // Connectors status
    var upperConnector = cube.find(".uppercont");
    var downConnector = cube.find(".downcont");
    var connectorStatus = [];
    
    if (upperConnector.hasClass("enable")) connectorStatus.push("Top");
    if (downConnector.hasClass("enable")) connectorStatus.push("Bottom");
    
    $("#propConnectors").text(connectorStatus.length > 0 ? connectorStatus.join(", ") : "None");
}

initCubePropertiesModal();

  // Initialize grpCounter with current maximum..new add
  grpCounter = getCurrentMaxGroupCounter();

//   function generateHoverHelpers() {
//  var adjustTopCont = {
//         0: [-35, 0],
//         45: [-25, 20],
//         90: [-35, 35],
//         135: [-25, 45],
//         180: [-35, 40],
//         225: [-60, 55],
//         270: [-70, 35],
//         315: [-55, 15],
//     };

//     var adjustDownCont = {
//         0: [-35, 0],
//         45: [-64, 6],
//         90: [-90, -18],
//         135: [-63, -46],
//         180: [-35, -68],
//         225: [-20, -36],
//         270: [-15, -18],
//         315: [-17, 0],
//     };


//    $(".downcont, .uppercont").each(function () {
//         // Check if the connector belongs to a locked group
//         var groupContainer = $(this).closest(".grpCont");
//         var isConnectorLocked = groupContainer.length ? isGroupLocked(groupContainer) : false;
        
//         if (
//             $(this).hasClass("enable") &&
//             !$(this).parents(".grpCont").hasClass("ui-draggable-dragging") &&
//             !$(this).parents(".tool-grp")[0] &&
//             !isConnectorLocked // NEW: Skip locked group connectors
//         ) {
//             var transformMtrx = $(this).parents(".hasGroup").css("transform");
//             var tempSelector = new Date().getTime() + parseInt(Math.random() * 1000);
//             $(this).attr("hover-helper", tempSelector);

//             var position = this.getBoundingClientRect();
//             var rotate = $(this).parents(".hasGroup").attr("rotateval");

//             var height = $(this).height();
//             var width = $(this).width();

//             if ($(this).hasClass("uppercont")) {
//                 var top = $(this).offset().top + adjustTopCont[rotate][1];
//                 var left = position.left + adjustTopCont[rotate][0];
//             } else if ($(this).hasClass("downcont")) {
//                 var top = $(this).offset().top + adjustDownCont[rotate][1];
//                 var left = position.left + adjustDownCont[rotate][0];
//             }
            
//             var grpWrapper = $(this).parents(".hasGroup");
//             var trns_origine = grpWrapper.offset();

//             var str = '<div class="hover-helper" id="' + tempSelector + '" ></div>';
//             $("body").append(str);

//             var ht = 0;
//             var tp = 0;
//             var wd = 0;
            
//             wd = 70;

//             if ($(this).hasClass("uppercont")) {
//                 ht = 90;
//                 tp = -60;
//             } else if ($(this).hasClass("downcont")) {
//                 ht = 90;
//                 tp = -7;
//             }

//             $("#" + tempSelector).css({
//                 height: height + ht + "px",
//                 width: width + wd + "px",
//                 top: top + tp + "px",
//                 left: left + "px",
//                 transform: "rotate(" + rotate + "deg)",
//             });
//             addEvents();
//         }
//     });
    
//     makeHoverHelperDroppable();
// }
//kk

function generateHoverHelpers() {
    var adjustTopCont = {
        0: [-35, 0],
        45: [-25, 20],
        90: [-35, 35],
        135: [-25, 45],
        180: [-35, 40],
        225: [-60, 55],
        270: [-70, 35],
        315: [-55, 15],
    };

    var adjustDownCont = {
        0: [-35, 0],
        45: [-64, 6],
        90: [-90, -18],
        135: [-63, -46],
        180: [-35, -68],
        225: [-20, -36],
        270: [-15, -18],
        315: [-17, 0],
    };

    $(".downcont, .uppercont").each(function () {
        // Check if the connector belongs to a locked group
        var groupContainer = $(this).closest(".grpCont");
        var isConnectorLocked = groupContainer.length ? isGroupLocked(groupContainer) : false;
        
        if (
            $(this).hasClass("enable") &&
            !$(this).parents(".grpCont").hasClass("ui-draggable-dragging") &&
            !$(this).parents(".tool-grp")[0] &&
            !isConnectorLocked // Skip locked group connectors
        ) {
            var transformMtrx = $(this).parents(".hasGroup").css("transform");
            var tempSelector = new Date().getTime() + parseInt(Math.random() * 1000);
            $(this).attr("hover-helper", tempSelector);

            var position = this.getBoundingClientRect();
            var rotate = $(this).parents(".hasGroup").attr("rotateval");

            var height = $(this).height();
            var width = $(this).width();

            if ($(this).hasClass("uppercont")) {
                var top = $(this).offset().top + adjustTopCont[rotate][1];
                var left = position.left + adjustTopCont[rotate][0];
            } else if ($(this).hasClass("downcont")) {
                var top = $(this).offset().top + adjustDownCont[rotate][1];
                var left = position.left + adjustDownCont[rotate][0];
            }
            
            var grpWrapper = $(this).parents(".hasGroup");
            var trns_origine = grpWrapper.offset();

            var str = '<div class="hover-helper" id="' + tempSelector + '" ></div>';
            $("body").append(str);

            var ht = 0;
            var tp = 0;
            var wd = 0;
            
            wd = 70;

            if ($(this).hasClass("uppercont")) {
                ht = 90;
                tp = -60;
            } else if ($(this).hasClass("downcont")) {
                ht = 90;
                tp = -7;
            }

            $("#" + tempSelector).css({
                height: height + ht + "px",
                width: width + wd + "px",
                top: top + tp + "px",
                left: left + "px",
                transform: "rotate(" + rotate + "deg)",
            });
            
            // FIX: Make hover helpers more sensitive and ensure they're droppable
            makeHoverHelperDroppable($("#" + tempSelector));
        }
    });
}


function removeHoverHelpers() {
    $(".hover-helper").each(function () {
        $(this).remove();
    });
    $(".downcont, .uppercont").each(function () {
        $(this).removeAttr("hover-helper");
        // Ensure opacity is reset when not hovering
        $(this).css({ opacity: "0" });
    });

    // Reset hitConnector when helpers are removed
    hitConnector = "";
    
    //remove grpCont...
    $(".drop-container")
        .find(".grpCont")
        .each(function (index) {
            if ($(this).find(".cubes-clone").length <= 0) {
                console.log($(this)[0]);
                $(this).remove();
            }
        });
}

function makeGroupDraggable() {
    $(".grpCont").draggable({
        start: function (event, ui) {
            // Check if group is locked
            if (isGroupLocked($(this))) {
                return false;
            }
            
            // Check if any cube in group is locked
            var hasLockedCubes = $(this).find(".cubes-clone").toArray().some(function(cube) {
                return isCubeLocked($(cube));
            });
            
            if (hasLockedCubes) {
                return false;
            }
            
            grpHit = false;
            currentDragGrpId = $(this).attr("id");
            console.log("current drag Id...  ", currentDragGrpId);
            generateHoverHelpers();
            $(".rotategrp").each(function (index) {
                $(this).hide();
            });

            var arrZIndex = [];
            $(".drop-container")
                .find(".grpCont")
                .each(function () {
                    arrZIndex.push($(this).css("z-index"));
                });
            arrZIndex.sort(function (a, b) {
                return b - a;
            });
            $("#" + currentDragGrpId).css({
                "z-index": Number(arrZIndex[0]) + 1,
            });
            
        },
        drag: function (event, ui) {
            isDraggable = true;
            
        },
        stop: function (event, ui) {
            removeHoverHelpers();
            $(".rotategrp").each(function (index) {
                $(this).show();
            });
             $(".uppercont, .downcont").css({ opacity: "0" });
        },
    });
     resetTools();
}

  function showHideSeparateRotateToolInGrp(bool) {
    if (!bool) {
      $(".drop-container").find(".grpCont").find(".spearateCubes").hide();
      $(".drop-container").find(".grpCont").find(".rotategrp").hide();
    } else {
      $(".drop-container").find(".grpCont").find(".spearateCubes").show();
      $(".drop-container").find(".grpCont").find(".rotategrp").show();
    }
  }

var lockedGroups = new Set();

// Update the existing setCubesPosition function to respect group lockslive
// function setCubesPosition() {
//     var totalCubes = 0;
//     var totalConnectorHt = 0;
//     var oneCubeHt = 0;
//     oldHtOfRotateGrp = $("#grp" + currentGrpCounter).height();

//     $("#grp" + currentGrpCounter)
//         .find(".cubes-clone")
//         .each(function (index) {
//             if ($(this).is(":visible")) {
//                 totalCubes = totalCubes + 1;
//                 totalConnectorHt = totalConnectorHt + Math.abs(connectorHt);
//                 oneCubeHt = $(this).height();
//             }
//         });

//     newHtOfRotateGrp = Number(oneCubeHt * totalCubes) - totalConnectorHt + connectorHt;

//     $(
//         $("#grp" + currentGrpCounter)
//             .find(".cubes-clone")
//             .get()
//             .reverse()
//     ).each(function (index) {
//         $(this).css({
//             "z-index": index,
//         });
//     });

//     var newId = 0;
//     $($("#grp" + currentGrpCounter).find(".cubes-clone")).each(function (index) {
//         if ($(this).is(":visible")) {
//             newId = newId + 1;
//             $(this).attr("newcubesid", Number(newId));
//         }
        
//         // Reset all connectors first
//         $(this).find(".uppercont").css({
//             display: "none",
//             opacity: "0"
//         });
//         $(this).find(".downcont").css({
//             display: "none", 
//             opacity: "0"
//         });
//         $(this).find(".uppercont").removeClass("enable");
//         $(this).find(".downcont").removeClass("enable");
//     });

//     // FIXED: Only enable connectors for top and bottom cubes
//     $($("#grp" + currentGrpCounter).find(".cubes-clone")).each(function (index) {
//         var cubeId = $(this).attr("newcubesid");
//         var isLocked = isCubeLocked($(this));
        
//         if (!isLocked) {
//             if (cubeId == "1") {
//                 // First cube - enable TOP connector only
//                 $(this).find(".uppercont").addClass("enable");
//                 $(this).find(".uppercont").css({
//                     display: "block"
//                 });
//             } else if (cubeId == totalCubes) {
//                 // Last cube - enable BOTTOM connector only  
//                 $(this).find(".downcont").addClass("enable");
//                 $(this).find(".downcont").css({
//                     display: "block"
//                 });
//             } 


// function setCubesPosition() {
//     var totalCubes = 0;
//     var totalConnectorHt = 0;
//     var oneCubeHt = 0;
//     oldHtOfRotateGrp = $("#grp" + currentGrpCounter).height();

//     $("#grp" + currentGrpCounter)
//         .find(".cubes-clone")
//         .each(function (index) {
//             if ($(this).is(":visible")) {
//                 totalCubes = totalCubes + 1;
//                 totalConnectorHt = totalConnectorHt + Math.abs(connectorHt);
//                 oneCubeHt = $(this).height();
//             }
//         });

//     newHtOfRotateGrp = Number(oneCubeHt * totalCubes) - totalConnectorHt + connectorHt;

//     $(
//         $("#grp" + currentGrpCounter)
//             .find(".cubes-clone")
//             .get()
//             .reverse()
//     ).each(function (index) {
//         $(this).css({
//             "z-index": index,
//         });
//     });

//     var newId = 0;
//     $($("#grp" + currentGrpCounter).find(".cubes-clone")).each(function (index) {
//         if ($(this).is(":visible")) {
//             newId = newId + 1;
//             $(this).attr("newcubesid", Number(newId));
//         }
//         $(this).find(".uppercont").css({
//             display: "none",
//         });
//         $(this).find(".downcont").css({
//             display: "none",
//         });
//         $(this).find(".uppercont").css({
//             opacity: "0",
//         });
//         $(this).find(".downcont").css({
//             opacity: "0",
//         });
//     });

//     $($("#grp" + currentGrpCounter).find(".cubes-clone")).each(function (index) {
//         // NEW: Only enable connectors if group is not locked
//         var groupContainer = $(this).closest(".grpCont");
//         var isLocked = groupContainer.length ? isGroupLocked(groupContainer) : false;
        
//         if (!isLocked) {
//             if ($(this).attr("newcubesid") == "1") {
//                 $(this).find(".uppercont").addClass("enable");
//                 $(this).find(".downcont").removeClass("enable");
//                 $(this).find(".uppercont").css({
//                     display: "block",
//                 });
//             } else if ($(this).attr("newcubesid") == totalCubes) {
//                 $(this).find(".uppercont").removeClass("enable");
//                 $(this).find(".downcont").addClass("enable");
//                 $(this).find(".downcont").css({
//                     display: "block",
//                 });
//             } else {
//                 $(this).find(".uppercont").removeClass("enable");
//                 $(this).find(".downcont").removeClass("enable");
//             }
//         } 
// else {
//                 $(this).find(".uppercont").removeClass("enable");
//                 $(this).find(".downcont").removeClass("enable");
//             }
        
//     });
//    var totalCubes = $("#grp" + grpCounter).find(".cubes-clone").length;
// var oneCubeHt = $("#grp" + grpCounter).find(".cubes-clone").first().height();
// var groupHeight = (oneCubeHt * totalCubes) - (connectorHt * (totalCubes - 1));

// $("#grp" + grpCounter + " #rotategrp2").css({ top: groupHeight + "px" });
// $("#grp" + grpCounter + " #rotategrp3").css({ top: groupHeight + "px" });
// }

function setCubesPosition() {
    var totalCubes = 0;
    var totalConnectorHt = 0;
    var oneCubeHt = 0;
    oldHtOfRotateGrp = $("#grp" + currentGrpCounter).height();

    $("#grp" + currentGrpCounter)
        .find(".cubes-clone")
        .each(function (index) {
            if ($(this).is(":visible")) {
                totalCubes = totalCubes + 1;
                totalConnectorHt = totalConnectorHt + Math.abs(connectorHt);
                oneCubeHt = $(this).height();
            }
        });

    newHtOfRotateGrp = Number(oneCubeHt * totalCubes) - totalConnectorHt + connectorHt;

    $(
        $("#grp" + currentGrpCounter)
            .find(".cubes-clone")
            .get()
            .reverse()
    ).each(function (index) {
        $(this).css({
            "z-index": index,
        });
    });

    var newId = 0;
    $($("#grp" + currentGrpCounter).find(".cubes-clone")).each(function (index) {
        if ($(this).is(":visible")) {
            newId = newId + 1;
            $(this).attr("newcubesid", Number(newId));
        }
        $(this).find(".uppercont").css({
            display: "none",
        });
        $(this).find(".downcont").css({
            display: "none",
        });
        $(this).find(".uppercont").css({
            opacity: "0",
        });
        $(this).find(".downcont").css({
            opacity: "0",
        });
    });

    // FIXED: Proper connector logic - only enable top connector for first cube and bottom connector for last cube
    $($("#grp" + currentGrpCounter).find(".cubes-clone")).each(function (index) {
        var cubePosition = parseInt($(this).attr("newcubesid"));
        
        // NEW: Only enable connectors if group is not locked
        var groupContainer = $(this).closest(".grpCont");
        var isLocked = groupContainer.length ? isGroupLocked(groupContainer) : false;
        
        // if (!isLocked) {
        //     if (cubePosition === 1) {
        //         // First cube - enable top connector only
        //         $(this).find(".uppercont").addClass("enable");
        //         $(this).find(".downcont").removeClass("enable");
        //         $(this).find(".uppercont").css({
        //             display: "block",
        //         });
        //     } else if (cubePosition === totalCubes) {
        //         // Last cube - enable bottom connector only  
        //         $(this).find(".uppercont").removeClass("enable");
        //         $(this).find(".downcont").addClass("enable");
        //         $(this).find(".downcont").css({
        //             display: "block",
        //         });
        //     } else {
        //         // Middle cubes - disable both connectors
        //         $(this).find(".uppercont").removeClass("enable");
        //         $(this).find(".downcont").removeClass("enable");
        //     }
        // } else {
        //     // If group is locked, disable all connectors
        //     $(this).find(".uppercont").removeClass("enable");
        //     $(this).find(".downcont").removeClass("enable");
        // }

if (!isLocked) {
    var cubeId = $(this).attr("newcubesid");
    
    // FIX: When connecting to a single cube (totalCubes === 1), enable BOTH connectors
    if (totalCubes === 1) {
        $(this).find(".uppercont").addClass("enable");
        $(this).find(".downcont").addClass("enable");
        $(this).find(".uppercont").css({
            display: "block",
        });
        $(this).find(".downcont").css({
            display: "block",
        });
    } 
    // First cube in multi-cube group
    else if (cubeId == "1") {
        $(this).find(".uppercont").addClass("enable");
        $(this).find(".downcont").removeClass("enable");
        $(this).find(".uppercont").css({
            display: "block",
        });
    } 
    // Last cube in multi-cube group  
    else if (cubeId == totalCubes) {
        $(this).find(".uppercont").removeClass("enable");
        $(this).find(".downcont").addClass("enable");
        $(this).find(".downcont").css({
            display: "block",
        });
    } 
    // Middle cubes in multi-cube group
    else {
        $(this).find(".uppercont").removeClass("enable");
        $(this).find(".downcont").removeClass("enable");
    }
}
        
    });
    
    var totalCubes = $("#grp" + grpCounter).find(".cubes-clone").length;
    var oneCubeHt = $("#grp" + grpCounter).find(".cubes-clone").first().height();
    var groupHeight = (oneCubeHt * totalCubes) - (connectorHt * (totalCubes - 1));

    $("#grp" + grpCounter + " #rotategrp2").css({ top: groupHeight + "px" });
    $("#grp" + grpCounter + " #rotategrp3").css({ top: groupHeight + "px" });
}

  // function makeHoverHelperDroppable() {
  //   if (
  //     uagent.indexOf("ipad") != -1 ||
  //     uagent.indexOf("iphone") != -1 ||
  //     uagent.indexOf("android") != -1
  //   ) {
  //     $(".hover-helper").droppable({
  //       tolerance: "touch",
  //       over: function () {
  //         grpHit = true;
  //         console.log("hover helper touch ", hitConnector);
  //         if ($("[hover-helper='" + this.id + "']").hasClass("uppercont")) {
  //           console.log("-----up-----");
  //           hitConnector = "up";
  //           $("[hover-helper='" + this.id + "']").css({
  //             opacity: "1",
  //           });
  //         } else if (
  //           $("[hover-helper='" + this.id + "']").hasClass("downcont")
  //         ) {
  //           console.log("-----down-----");
  //           hitConnector = "down";
  //           $("[hover-helper='" + this.id + "']").css({
  //             opacity: "1",
  //           });
  //         }
  //       },
  //       out: function () {
  //         console.log("grpHit false...");
  //         setTimeout(function () {
  //           grpHit = false;
  //           $(".downcont, .uppercont").each(function () {
  //             $(this).css({ opacity: "0" });
  //           });
  //         }, 200);
  //       },
  //     });
  //   }
  // }
function makeHoverHelperDroppable(hoverHelper) {
    hoverHelper.droppable({
        tolerance: "pointer",
        greedy: true,
        over: function (event, ui) {
            grpHit = true;
            var helperId = $(this).attr("id");
            var connector = $("[hover-helper='" + helperId + "']");
            
            if (connector.hasClass("uppercont")) {
                hitConnector = "up";
                connector.css({ opacity: "1" });
            } else if (connector.hasClass("downcont")) {
                hitConnector = "down"; 
                connector.css({ opacity: "1" });
            }
            
            // Store the target group
            currentGrpCounter = connector.closest(".grpCont").attr("id").split("grpCont")[1];
            console.log("Hover over connector of group:", currentGrpCounter);
        },
        out: function () {
            setTimeout(function () {
                grpHit = false;
                $(".downcont, .uppercont").each(function () {
                    $(this).css({ opacity: "0" });
                });
            }, 100);
        },
        drop: function (event, ui) {
            // This ensures the drop event is handled by the main drop handler
            console.log("Drop on hover helper detected");
        }
    });
}
  var tempArrX = [];
  var tempArrY = [];

  var sMY = 0;
  var sMX = 0;

  document.addEventListener("mousemove", function () {
    // console.log("selected tool ", isSelectedTool);

    if (isSelectedTool == "") {
      $("#").css({ "pointer-events": "none" });
      $(".tempItem").css({ "pointer-events": "none" });
      $("body").removeAttr("style");
      $("body").removeAttr("class");
    } else {
      $(".tempItem").css({ "pointer-events": "none" });
      $(".clickable1").css({ "pointer-events": "auto" });
    }

    if (isSelectedTool == "eraser") {
      $("#").css({ "pointer-events": "none" });
    } 
  });

  document.addEventListener("touchmove", function () {
    console.log("selectedTool ", isSelectedTool);

    if (isSelectedTool == "") {
      $("#").css({ "pointer-events": "none" });
      $(".tempItem").css({ "pointer-events": "none" });
      $("body").removeAttr("style");
      $("body").removeAttr("class");
    } else {
      $(".tempItem").css({ "pointer-events": "none" });
      $(".clickable1").css({ "pointer-events": "auto" });
    }

    if (isSelectedTool == "eraser") {
      $("#").css({ "pointer-events": "none" });
    } 
  });

// dddffdddd

// function initTouchSupport() {
//     var touchTimer;
//     var longPressDuration = 500;
//     var touchStartX, touchStartY;
//     var touchMoved = false;
    
//     // Touch start event for cubes
//     $(document).on('touchstart', '.cubes, .cubes-clone', function(e) {
//         var touch = e.originalEvent.touches[0];
//         touchStartX = touch.clientX;
//         touchStartY = touch.clientY;
//         touchMoved = false;
        
//         currentRightClickedCube = $(this);
        
//         touchTimer = setTimeout(function() {
//             showCubeMenuForTouch(e, currentRightClickedCube);
//         }, longPressDuration);
        
//         e.preventDefault();
//     });
    
//     // Touch start event for empty areas
//     $(document).on('touchstart', function(e) {
//         if (!$(e.target).closest(".cubes, .cubes-clone, .grpCont, .tool-container").length) {
//             var touch = e.originalEvent.touches[0];
//             touchStartX = touch.clientX;
//             touchStartY = touch.clientY;
//             touchMoved = false;
            
//             currentRightClickedCube = null;
            
//             touchTimer = setTimeout(function() {
//                 showEmptyAreaMenuForTouch(e);
//             }, longPressDuration);
//         }
//     });
    
//     // Touch move event
//     $(document).on('touchmove', function(e) {
//         if (!touchTimer) return;
        
//         var touch = e.originalEvent.touches[0];
//         var deltaX = Math.abs(touch.clientX - touchStartX);
//         var deltaY = Math.abs(touch.clientY - touchStartY);
        
//         if (deltaX > 10 || deltaY > 10) {
//             touchMoved = true;
//             clearTimeout(touchTimer);
//             touchTimer = null;
//         }
//     });
    
//     // Touch end event
//     $(document).on('touchend', function(e) {
//         clearTimeout(touchTimer);
//         touchTimer = null;
        
//         if (!touchMoved && currentRightClickedCube && !currentRightClickedCube.hasClass('menu-shown')) {
//             setTimeout(function() {
//                 handleCubeTap(currentRightClickedCube);
//             }, 100);
//         }
        
//         setTimeout(function() {
//             $('.cubes, .cubes-clone').removeClass('menu-shown');
//         }, 500);
//     });
// }

function initTouchSupport() {
    var touchTimer;
    var longPressDuration = 500;
    var touchStartX, touchStartY;
    var touchMoved = false;
    
    // Touch start event for cubes
    $(document).on('touchstart', '.cubes, .cubes-clone', function(e) {
        var touch = e.originalEvent.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchMoved = false;
        
        currentRightClickedCube = $(this);
        
        touchTimer = setTimeout(function() {
            // PREVENT CUBE SEPARATION: Don't trigger the spearate cubes functionality
            // Just show the menu without allowing cube separation
            showCubeMenuForTouch(e, currentRightClickedCube);
        }, longPressDuration);
        
        e.preventDefault();
    });
    
    // Touch start event for empty areas
    $(document).on('touchstart', function(e) {
        if (!$(e.target).closest(".cubes, .cubes-clone, .grpCont, .tool-container").length) {
            var touch = e.originalEvent.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchMoved = false;
            
            currentRightClickedCube = null;
            
            touchTimer = setTimeout(function() {
                showEmptyAreaMenuForTouch(e);
            }, longPressDuration);
        }
    });
    
    // Touch move event
    $(document).on('touchmove', function(e) {
        if (!touchTimer) return;
        
        var touch = e.originalEvent.touches[0];
        var deltaX = Math.abs(touch.clientX - touchStartX);
        var deltaY = Math.abs(touch.clientY - touchStartY);
        
        if (deltaX > 10 || deltaY > 10) {
            touchMoved = true;
            clearTimeout(touchTimer);
            touchTimer = null;
        }
    });
    
    // Touch end event - PREVENT CUBE SEPARATION
    $(document).on('touchend', function(e) {
        clearTimeout(touchTimer);
        touchTimer = null;
        
        // PREVENT CUBE SEPARATION: Remove the cube tap handling that causes separation
        // Don't call handleCubeTap on long-press scenarios
        if (!touchMoved && currentRightClickedCube && !currentRightClickedCube.hasClass('menu-shown')) {
            // Allow regular short taps for other interactions, but prevent separation
            setTimeout(function() {
                // Only handle regular clicks, not the separation logic
                if (isSelectedTool == "eraser") {
                    handleCubeTap(currentRightClickedCube);
                }
                // Otherwise, do nothing - prevent cube separation
            }, 100);
        }
        
        setTimeout(function() {
            $('.cubes, .cubes-clone').removeClass('menu-shown');
        }, 500);
    });
}


function showEmptyAreaMenuForTouch(e) {
    var touch = e.originalEvent.touches[0];
    var x = touch.clientX;
    var y = touch.clientY;
    
    positionCubeMenu(x, y);
    
    // Hide all regular menu items first
    $("#cubeMenu button").hide();
    $("#cubeMenu .cube-menu-section").hide();
    $("#cubeMenu hr").hide();
    
    // Create or show the message element if it doesn't exist
    if (!$("#cubeMenuMessage").length) {
        $("#cubeMenu").prepend('<div id="cubeMenuMessage" style="padding: 8px 16px; font-size: 14px; color: #666;"></div>');
    }
    
    if (copiedCubeData) {
        $("#cubeMenu button[data-action='paste']").show();
        $("#cubeMenuMessage").hide();
    } else {
        $("#cubeMenuMessage").text("You have no copy cube").show();
    }
    
    // Prevent the document click handler from immediately hiding the menu
    e.stopPropagation();
    e.preventDefault();
}

function showCubeMenuForTouch(e, cube) {
    cube.addClass('menu-shown');
    
    var touch = e.originalEvent.touches[0];
    var x = touch.clientX;
    var y = touch.clientY;
    
    positionCubeMenu(x, y);
    updateMenuForCube(cube);
    
    // Ensure regular menu is shown properly
    $("#cubeMenuMessage").hide();
    $("#cubeMenu .cube-menu-section").show();
    $("#cubeMenu hr").show();
    
    // Prevent the document click handler from immediately hiding the menu
    e.stopPropagation();
    e.preventDefault();
}

// NEW: Handle cube tap (short tap)
// function handleCubeTap(cube) {
//     if (!cube) return;
    
//     // Your existing click logic for cubes
//     if (isCubeLocked(cube) && isSelectedTool == "") {
//         return; // Prevent color changes when locked
//     }
    
//     $(".clickable").css({ "pointer-events": "none" });
//     setTimeout(function() {
//         $(".clickable").css({ "pointer-events": "auto" });
//     }, 200);
    
//     if (isDraggable) {
//         return;
//     }
    
//     // Continue with your existing cube click logic...
//     // This should match what you have in the click handler
// }
// NEW: Handle cube tap (short tap) - PREVENT SEPARATION
function handleCubeTap(cube) {
    if (!cube) return;
    
    // Your existing click logic for cubes
    if (isCubeLocked(cube) && isSelectedTool == "") {
        return; // Prevent color changes when locked
    }
    
    $(".clickable").css({ "pointer-events": "none" });
    setTimeout(function() {
        $(".clickable").css({ "pointer-events": "auto" });
    }, 200);
    
    if (isDraggable) {
        return;
    }
    
    // PREVENT CUBE SEPARATION: Only allow eraser functionality on tap
    // Don't execute the cube separation logic that was in the original click handler
    if (isSelectedTool == "eraser") {
        // Continue with your existing eraser logic...
        var totalCubes = 0;
        currentGrpCounter = cube.parent().attr("id").split("grp")[1];

        //when we click cubes using eraser tool to delete it..
        if (isSelectedTool == "eraser") {
            var totalCubes = 0;
            var object1 = document.getElementById(
              "grpCont" + currentGrpCounter
            );
            var lastGrpPos = object1.getBoundingClientRect();

            cube
              .parents(".grpCont")
              .find(".cubes-clone")
              .each(function (index) {
                totalCubes = totalCubes + 1;
              });

            currentActStatus = "eraseDrop";
            currentObj = cube;
            console.log("ccccccc ", currentGrpCounter);
            $("#grpCont" + currentGrpCounter)
              .find(".rotategrp")
              .each(function (index) {
                $(this).remove();
              });

            var cubeId = cube.attr("newcubesid");
            cube
              .parents(".grpCont")
              .find(".cubes-clone")
              .each(function (index) {
                $(this).css({ top: "0px" });
              });

            if (totalCubes <= 1) {
              cube.parents(".grpCont").remove();
            } else {
              cube.remove();
            }

            $("#grp" + currentGrpCounter)
              .find(".cubes-clone")
              .each(function (index) {
                if (index > 0) {
                  $(this).css({
                    top:
                      parseInt($(this).prev().css("top")) +
                      parseInt($(this).prev().height() - connectorHt) +
                      "px",
                  });
                }
              });

            setCubesPosition();

            var rotateStr =
              '<div class="rotategrp clickable" id="rotategrp1"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp2"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp3"><img src="assets/images/rotategroup.png"/></div><div class="rotategrp clickable" id="rotategrp4"><img src="assets/images/rotategroup.png"/></div>';

            $("#grp" + currentGrpCounter).prepend(rotateStr);

            var rotateGrpDiv = $("#grp" + currentGrpCounter).find(
              "#rotategrp1"
            );
            $("#grp" + currentGrpCounter)
              .find("#rotategrp1")
              .css({ top: -19 + "px" });
            $("#grp" + currentGrpCounter)
              .find("#rotategrp4")
              .css({ top: -19 + "px" });

            if (newHtOfRotateGrp > 0) {
              console.log("ht...... ");
              $("#grpCont" + currentGrpCounter)
                .find("#rotategrp2")
                .css({ top: newHtOfRotateGrp + "px" });
              $("#grpCont" + currentGrpCounter)
                .find("#rotategrp3")
                .css({ top: newHtOfRotateGrp + "px" });
            }

            $("#undo").addClass("enabled");
            $("#undo").removeClass("disabled");

            addEvents();
            var zIndex = 0;
            $(
              $("#grp" + currentGrpCounter)
                .find(".cubes-clone")
                .get()
                .reverse()
            ).each(function (index) {
              zIndex = zIndex + 1;
              $(this).css({
                "z-index": zIndex,
              });
            });
        }
    }
    // PREVENT CUBE SEPARATION: Don't execute the separation logic for regular taps
}

// NEW: Toggle group count display
function toggleGroupCountDisplay() {
    isGroupCountActive = !isGroupCountActive;
    
    if (isGroupCountActive) {
        // Activate button
        $("#groupCount").addClass("active");
        $("#groupCount").css("opacity", "1");
        
        // Show counts for all groups
        showAllGroupCounts();
        
        // Update counts when groups change
        startGroupCountMonitoring();
        
        console.log("Group Count activated");
    } else {
        // Deactivate button
        $("#groupCount").removeClass("active");
        $("#groupCount").css("opacity", "0.6");
        
        // Remove all count displays
        removeAllGroupCounts();
        
        // Stop monitoring
        stopGroupCountMonitoring();
        
        console.log("Group Count deactivated");
    }
}

// NEW: Show counts for all existing groups
function showAllGroupCounts() {
    $(".grpCont").each(function() {
        var groupContainer = $(this);
        createGroupCountDisplay(groupContainer);
    });
}

// NEW: Create count display for a single group
// FIXED: Create count display with rotation support
// UPDATED: Create count display (simplified)
function createGroupCountDisplay(groupContainer) {
    var groupId = groupContainer.attr("id");
    
    // Remove existing display if any
    removeGroupCountDisplay(groupId);
    
    var cubes = groupContainer.find(".cubes-clone");
    var cubeCount = cubes.length;
    
    if (cubeCount <= 1) {
        return; // Don't show count for single cubes
    }
    
    // Create count display
    var countDisplay = $('<div class="group-count-display"></div>');
    countDisplay.text(cubeCount);
    countDisplay.attr('data-group-id', groupId);
    
    // Add to container and store reference
    $(".drop-container").append(countDisplay);
    groupCountDisplays.set(groupId, countDisplay);
    
    // Create bracket visualization
    var groupRect = groupContainer[0].getBoundingClientRect();
    var containerRect = $(".drop-container")[0].getBoundingClientRect();
    createBracketVisualization(groupContainer, groupRect, containerRect, cubeCount);
    
    // Make count display move with group
    makeCountDisplayDraggable(groupContainer, countDisplay);
}


// UPDATED: Create bracket visualization with count on top (no line)
function createBracketVisualization(groupContainer, groupRect, containerRect, cubeCount) {
    var groupId = groupContainer.attr("id");

    // If a display exists (maybe detached or in DOM), detach it temporarily so it won't be removed
    var existingDisplay = $('.group-count-display[data-group-id="' + groupId + '"]');
    if (existingDisplay.length) {
        existingDisplay = existingDisplay.detach(); // keep it in memory
    } else if (groupCountDisplays.has(groupId)) {
        // fallback to what's stored in map (detached or jQuery object)
        existingDisplay = groupCountDisplays.get(groupId);
        if (existingDisplay && existingDisplay.length && !$.contains(document, existingDisplay[0])) {
            // already detached; keep it as is
        }
    }

    // Remove existing bracket safely (display already detached so it won't be removed)
    $('.group-count-bracket[data-group-id="' + groupId + '"]').remove();
    $('.count-line[data-group-id="' + groupId + '"]').remove();

    // Calculate the ACTUAL group bounds
    var actualGroupBounds = calculateActualGroupBounds(groupContainer);

    // Get rotation value from the group
    var rotation = 0;
    var hasGroup = groupContainer.find(".hasGroup");
    if (hasGroup.length) {
        rotation = parseInt(hasGroup.attr("rotateVal")) || 0;
    }

    var bracketPadding = 8;
    var fixedBracketWidth = 50; // Fixed width

    // Calculate bracket position (centered on group)
    var bracketLeft = (actualGroupBounds.left + actualGroupBounds.right) / 2 - containerRect.left - (fixedBracketWidth / 2) - 3;
    var bracketTop = (actualGroupBounds.top - containerRect.top - bracketPadding) - 2;
    var bracketHeight = actualGroupBounds.height + (bracketPadding * 2);

    // Create bracket with fixed width
    var bracket = $('<div class="group-count-bracket"></div>');
    bracket.attr('data-group-id', groupId);
    bracket.css({
        position: 'absolute',
        left: bracketLeft + 'px',
        top: bracketTop + 'px',
        width: fixedBracketWidth + 'px',
        height: bracketHeight + 'px'
    });

    // Apply rotation to bracket
    if (rotation !== 0) {
        bracket.css({
            transform: 'rotate(' + rotation + 'deg)'
        });
    }

    // Add to container
    $(".drop-container").append(bracket);

    // If we detached an existing display, attach it to the new bracket
    if (existingDisplay && existingDisplay.length) {
        // ensure display has absolute positioning inside bracket
        existingDisplay.css({
            position: "absolute",
            left: "50%",
            top: "-10px",
            transform: "translateX(-50%)"
        });
        bracket.append(existingDisplay);
        // make sure the map points to this jQuery element
        groupCountDisplays.set(groupId, existingDisplay);
    } else {
        // If no existing display found, try to locate one in the map and move it
        var mapDisplay = groupCountDisplays.get(groupId);
        if (mapDisplay && mapDisplay.length) {
            // move mapDisplay into bracket
            mapDisplay.css({
                position: "absolute",
                left: "50%",
                top: "-10px",
                transform: "translateX(-50%)"
            });
            bracket.append(mapDisplay);
        }
    }

    // Update count display position (relative to bracket)
    updateCountDisplayPosition(groupContainer, bracketLeft, bracketTop, fixedBracketWidth, bracketHeight, rotation);
// Remove old lines first
$('.count-line[data-group-id="' + groupId + '"]').remove();


    // Make bracket move with group
    makeBracketDraggable(groupContainer, bracket);
}

// lfnldsfd

function calculateActualGroupBounds(groupContainer) {
    var cubes = groupContainer.find(".cubes-clone");
    
    if (cubes.length === 0) {
        // Fallback to container bounds if no cubes
        var containerRect = groupContainer[0].getBoundingClientRect();
        return {
            left: containerRect.left,
            top: containerRect.top,
            right: containerRect.right,
            bottom: containerRect.bottom,
            width: containerRect.width,
            height: containerRect.height
        };
    }
    
    // Initialize bounds with first cube
    var firstCubeRect = cubes[0].getBoundingClientRect();
    var minX = firstCubeRect.left;
    var minY = firstCubeRect.top;
    var maxX = firstCubeRect.right;
    var maxY = firstCubeRect.bottom;
    
    // Find the actual bounds by checking all cubes
    cubes.each(function() {
        var cubeRect = this.getBoundingClientRect();
        minX = Math.min(minX, cubeRect.left);
        minY = Math.min(minY, cubeRect.top);
        maxX = Math.max(maxX, cubeRect.right);
        maxY = Math.max(maxY, cubeRect.bottom);
    });
    
    return {
        left: minX,
        top: minY,
        right: maxX,
        bottom: maxY,
        width: maxX - minX,
        height: maxY - minY
    };
}

// UPDATED: Make count display follow group during drag
function makeCountDisplayDraggable(groupContainer, countDisplay) {
    var groupId = groupContainer.attr("id");
    
    groupContainer.on('drag', function(event, ui) {
        if (!isGroupCountActive) return;
        
        // Update position based on current group bounds
        updateCountDisplayPosition(groupContainer);
    });
}
// FIXED: Handle rotation changes with bracket rotation
// UPDATED: Handle rotation changes (no line)
function handleRotationForBracket(groupContainer) {
    if (!isGroupCountActive) return;
    
    var groupId = groupContainer.attr("id");
    
    // Use a small delay to ensure rotation is complete
    setTimeout(function() {
        if (groupCountDisplays.has(groupId)) {
            // Get the new rotation value
            var rotation = 0;
            var hasGroup = groupContainer.find(".hasGroup");
            if (hasGroup.length) {
                rotation = parseInt(hasGroup.attr("rotateVal")) || 0;
            }
            
            // Update bracket rotation
            var bracket = $('.group-count-bracket[data-group-id="' + groupId + '"]');
            
            if (bracket.length) {
                bracket.css({
                    transform: 'rotate(' + rotation + 'deg)'
                });
                
                // Get bracket position for count display update
                var bracketRect = bracket[0].getBoundingClientRect();
                var containerRect = $(".drop-container")[0].getBoundingClientRect();
                
                var bracketLeft = (bracketRect.left - containerRect.left)-3;
                var bracketTop = bracketRect.top - containerRect.top;
                var bracketWidth = bracketRect.width;
                var bracketHeight = bracketRect.height;
                
                // Update count display position with rotation
                updateCountDisplayPosition(groupContainer, bracketLeft, bracketTop, bracketWidth, bracketHeight, rotation);
            }
        }
    }, 50);
}

// UPDATED: Make bracket follow group during drag (no line)
function makeBracketDraggable(groupContainer, bracket) {
    var groupId = groupContainer.attr("id");
    
    groupContainer.on('drag', function(event, ui) {
        if (!isGroupCountActive) return;
        
        // Recalculate bounds during drag
        var containerRect = $(".drop-container")[0].getBoundingClientRect();
        var actualGroupBounds = calculateActualGroupBounds(groupContainer);
        
        // Get current rotation
        var rotation = 0;
        var hasGroup = groupContainer.find(".hasGroup");
        if (hasGroup.length) {
            rotation = parseInt(hasGroup.attr("rotateVal")) || 0;
        }
        
        var bracketPadding = 8;
        var fixedBracketWidth = 50;
        
        // Calculate bracket position (centered on group)
        var bracketLeft = (actualGroupBounds.left + actualGroupBounds.right) / 2 - containerRect.left - (fixedBracketWidth / 2)-3;
        var bracketTop = actualGroupBounds.top - containerRect.top - bracketPadding;
        var bracketHeight = actualGroupBounds.height + (bracketPadding * 2);
        
        // Update bracket position and size
        bracket.css({
            left: bracketLeft + 'px',
            top: bracketTop + 'px',
            height: bracketHeight + 'px',
            transform: 'rotate(' + rotation + 'deg)'
        });
        
        // Update count display position (on top of bracket)
        updateCountDisplayPosition(groupContainer, bracketLeft, bracketTop, fixedBracketWidth, bracketHeight, rotation);
    });
}

// UPDATED: Remove count display for specific group (no line)
function removeGroupCountDisplay(groupId) {
    if (groupCountDisplays.has(groupId)) {
        groupCountDisplays.get(groupId).remove();
        groupCountDisplays.delete(groupId);
    }
    
    // Remove bracket (no line to remove)
    $('.group-count-bracket[data-group-id="' + groupId + '"]').remove();
}

// NEW: Remove all count displays
function removeAllGroupCounts() {
    groupCountDisplays.forEach(function(display, groupId) {
        display.remove();
    });
    groupCountDisplays.clear();
    
    // Remove all brackets and lines
    $('.group-count-bracket').remove();
    $('.count-line').remove();
}

// NEW: Update count for specific group
function updateGroupCount(groupContainer) {
    if (!isGroupCountActive) return;
    
    var groupId = groupContainer.attr("id");
    var cubes = groupContainer.find(".cubes-clone");
    var newCount = cubes.length;
    
    if (newCount <= 1) {
        // Remove display if group now has only 1 cube
        removeGroupCountDisplay(groupId);
        return;
    }
    
    if (groupCountDisplays.has(groupId)) {
        // Update existing count
        var countDisplay = groupCountDisplays.get(groupId);
        countDisplay.text(newCount);
        
        // Completely recreate bracket visualization with new bounds
        var containerRect = $(".drop-container")[0].getBoundingClientRect();
        var actualGroupBounds = calculateActualGroupBounds(groupContainer);
        createBracketVisualization(groupContainer, actualGroupBounds, containerRect, newCount);
        
        // Update count display position
        updateCountDisplayPosition(groupContainer, countDisplay);
    } else {
        // Create new display
        createGroupCountDisplay(groupContainer);
    }
}
// UPDATED: Position count display on top of the bracket
function updateCountDisplayPosition(groupContainer, bracketLeft, bracketTop, bracketWidth, bracketHeight, rotation) {
    if (!isGroupCountActive) return;
    
    var groupId = groupContainer.attr("id");
    if (!groupCountDisplays.has(groupId)) return;
    
    var countDisplay = groupCountDisplays.get(groupId);
    
    // If no position parameters provided, calculate them
    if (bracketLeft === undefined) {
        var containerRect = $(".drop-container")[0].getBoundingClientRect();
        var actualGroupBounds = calculateActualGroupBounds(groupContainer);
        
        // Get rotation value
        rotation = 0;
        var hasGroup = groupContainer.find(".hasGroup");
        if (hasGroup.length) {
            rotation = parseInt(hasGroup.attr("rotateVal")) || 0;
        }
        
        var bracketPadding = 8;
        bracketWidth = 50;
        bracketLeft = (actualGroupBounds.left + actualGroupBounds.right) / 2 - containerRect.left - (bracketWidth / 2)-3;
        bracketTop = actualGroupBounds.top - containerRect.top - bracketPadding;
        bracketHeight = actualGroupBounds.height + (bracketPadding * 2);
    }
    
    // Position count display centered on top of the bracket
    var countX = bracketLeft + (bracketWidth / 2);
    var countY = bracketTop - 5; // Slightly above the bracket
    
    countDisplay.css({
        left: countX + 'px',
        top: countY + 'px',
        transform: 'translate(-50%, -100%)' // Center horizontally and position above
    });
    
    // Apply rotation to count display to match bracket
    if (rotation !== 0) {
        countDisplay.css({
            transform: 'translate(-50%, -100%) rotate(' + 0 + 'deg)'
        });
    }
}
// NEW: Monitor group changes and update counts
var groupCountMonitorInterval = null;

function startGroupCountMonitoring() {
    groupCountMonitorInterval = setInterval(function() {
        if (!isGroupCountActive) return;
        
        // Check for new groups
        $(".grpCont").each(function() {
            var groupId = $(this).attr("id");
            if (!groupCountDisplays.has(groupId)) {
                createGroupCountDisplay($(this));
            }
        });
        
        // Update counts for existing groups
        groupCountDisplays.forEach(function(display, groupId) {
            var groupContainer = $("#" + groupId);
            if (groupContainer.length) {
                var currentCount = groupContainer.find(".cubes-clone").length;
                var displayCount = parseInt(display.text());
                
                if (currentCount !== displayCount) {
                    updateGroupCount(groupContainer);
                }
            } else {
                // Group was removed
                removeGroupCountDisplay(groupId);
            }
        });
    }, 500); // Check every 500ms
}

function stopGroupCountMonitoring() {
    if (groupCountMonitorInterval) {
        clearInterval(groupCountMonitorInterval);
        groupCountMonitorInterval = null;
    }
}

// NEW: Update your existing functions to maintain count displays




// undo4545ffffupddgfabir

// Undo/Redo Functions
function undoreSaveState() {
    // Save current state of all groups
    var state = {
        groups: [],
        timestamp: Date.now(),
        lockedGroups: Array.from(lockedGroups),
        lockedCubes: Array.from(lockedCubes)
    };
    
    $(".grpCont").each(function() {
        var group = $(this);
        var groupData = {
            id: group.attr("id"),
            html: group[0].outerHTML,
            position: {
                top: group.css("top"),
                left: group.css("left")
            },
            rotateval: group.attr("rotateval"),
            // FIX: Capture lock status
            isLocked: isGroupLocked(group)
        };
        state.groups.push(groupData);
    });
    
    // Add to undo stack
    undoreStack.push(state);
    
    // Limit stack size
    if (undoreStack.length > maxUndoreSteps) {
        undoreStack.shift();
    }
    
    // Clear redo stack when new action is performed
    redoreStack = [];
    
    // FIX: Update button states immediately
   
    console.log("State saved. Undo stack:", undoreStack.length);
}

function undorePerform() {
    if (undoreStack.length === 0) return;
    
    // Save current state to redo stack
    var currentState = {
        groups: [],
        timestamp: Date.now(),
        lockedGroups: Array.from(lockedGroups),
        lockedCubes: Array.from(lockedCubes)
    };
    
    $(".grpCont").each(function() {
        var group = $(this);
        var groupData = {
            id: group.attr("id"),
            html: group[0].outerHTML,
            position: {
                top: group.css("top"),
                left: group.css("left")
            },
            rotateval: group.attr("rotateval"),
            isLocked: isGroupLocked(group)
        };
        currentState.groups.push(groupData);
    });
    
    redoreStack.push(currentState);
    
    // Restore previous state
    var previousState = undoreStack.pop();
    undoreRestoreState(previousState);
    
    // FIX: Update button states immediately
    undoreUpdateButtonStates();
}

function redorePerform() {
    if (redoreStack.length === 0) return;
    
    // Save current state to undo stack
    var currentState = {
        groups: [],
        timestamp: Date.now(),
        lockedGroups: Array.from(lockedGroups),
        lockedCubes: Array.from(lockedCubes)
    };
    
    $(".grpCont").each(function() {
        var group = $(this);
        var groupData = {
            id: group.attr("id"),
            html: group[0].outerHTML,
            position: {
                top: group.css("top"),
                left: group.css("left")
            },
            rotateval: group.attr("rotateval"),
            isLocked: isGroupLocked(group)
        };
        currentState.groups.push(groupData);
    });
    
    undoreStack.push(currentState);
    
    // Restore next state
    var nextState = redoreStack.pop();
    undoreRestoreState(nextState);
    
    // FIX: Update button states immediately
    undoreUpdateButtonStates();
}

function undoreRestoreState(state) {
    // Clear current locked sets
    lockedGroups.clear();
    lockedCubes.clear();
    
    // Restore locked groups and cubes from state
    if (state.lockedGroups) {
        state.lockedGroups.forEach(function(groupId) {
            lockedGroups.add(groupId);
        });
    }
    
    if (state.lockedCubes) {
        state.lockedCubes.forEach(function(cubeId) {
            lockedCubes.add(cubeId);
        });
    }
    
    // Remove all existing groups
    $(".grpCont").remove();
    
    // Restore groups from state
    state.groups.forEach(function(groupData) {
        $(".drop-container").prepend(groupData.html);
        
        var restoredGroup = $("#" + groupData.id);
        restoredGroup.css({
            top: groupData.position.top,
            left: groupData.position.left
        });
        
        if (groupData.rotateval) {
            restoredGroup.attr("rotateval", groupData.rotateval);
            var hasGroup = restoredGroup.find(".hasGroup");
            hasGroup.attr("rotateVal", groupData.rotateval);
            hasGroup.css("transform", "rotate(" + groupData.rotateval + "deg)");
        }
        
        // FIX: Apply lock status from saved state
        if (groupData.isLocked) {
            lockedGroups.add(groupData.id);
            restoredGroup.find(".cubes-clone").each(function() {
                var cube = $(this);
                cube.addClass("cube-locked");
                cube.css("opacity", "0.5");
                lockedCubes.add(cube.attr("tempid"));
            });
            
            // Disable draggable for locked group
            if (restoredGroup.hasClass("ui-draggable")) {
                restoredGroup.draggable("disable");
            }
            
            // Disable connectors for locked group
            restoredGroup.find(".uppercont, .downcont").removeClass("enable");
            restoredGroup.find(".uppercont, .downcont").css({
                "pointer-events": "none",
                "opacity": "0.2"
            });
        } else {
            // FIX: Ensure group is properly unlocked and draggable
            lockedGroups.delete(groupData.id);
            restoredGroup.find(".cubes-clone").each(function() {
                var cube = $(this);
                cube.removeClass("cube-locked");
                cube.css("opacity", "1");
                lockedCubes.delete(cube.attr("tempid"));
            });
            
            // Re-enable connectors for unlocked group
            reenableGroupConnectors(restoredGroup);
        }
    });
    
    // FIX: Reinitialize ALL functionality properly
    setTimeout(function() {
        makeGroupDraggable();
        addEvents();
        
        // Update group counter
        grpCounter = getCurrentMaxGroupCounter();
        
        console.log("State restored. Groups:", state.groups.length, "Locked:", state.lockedGroups ? state.lockedGroups.length : 0);
    }, 50);
}
// 
function undoreUpdateButtonStates() {
    console.log("Updating button states - Undo:", undoreStack.length, "Redo:", redoreStack.length);
    
    // Update undo button
    if (undoreStack.length >0) {
        $("#undore").removeClass("disabled").addClass("clickable");
        console.log("Undo button ENABLED");
    } else {
        $("#undore").removeClass("clickable").addClass("disabled");
        console.log("Undo button DISABLED");
    }
    
    // Update redo button
    if (redoreStack.length > 0) {
        $("#redore").removeClass("disabled").addClass("clickable");
        console.log("Redo button ENABLED");
    } else {
        $("#redore").removeClass("clickable").addClass("disabled");
        console.log("Redo button DISABLED");
    }
}

function undoreClearHistory() {
    undoreStack = [];
    redoreStack = [];
    undoreUpdateButtonStates();
}
undoreClearHistory()
undoreUpdateButtonStates();


$(".cube-container-block").on("click", function(e) {
    // Only reset tools if clicking directly on the container, not on cubes inside
    if (e.target === this) {
        resetTools();
    }
});


eragerPencile()


function resetTools() {
    isSelectedTool = "";
    isDrawing = false;
        pencilActive = false;
        eraserActive = false;
    $("#draw").css('pointer-events','none')
    // $("#pencil").css({ opacity: "0.6" });
    $("#eraser").css({ opacity: "0.6" });
    // $("#pencil").removeClass("disabled").addClass("enabled");
    $("#eraser").removeClass("disabled").addClass("enabled");
    $("#pencilPanel").addClass('hide')
    $("#pencilTool").removeClass("active")
     $("#eraserPanel").addClass('hide')
    $("#eraserTool").removeClass("active")
    $("body").removeClass("addcursor");
    $("body").removeClass("addcursorPencil");
    $("#").css({ "pointer-events": "none" });
    showHideSeparateRotateToolInGrp(true);
      const ghost = document.getElementById("cursor-ghost");
    if (ghost) {
        ghost.style.display = "none";
    }
    document.body.classList.remove("hide-native-cursor");
    
    // Reset the activeTool variable from the internal JS
    if (typeof activeTool !== 'undefined') {
        activeTool = null;
    }
    
    // Alternative: Trigger the same behavior as the cube drag event
    document.querySelectorAll('.cubes, .grpCont').forEach(el => {
        el.dispatchEvent(new Event('mousedown'));
    });
    
}




initScreenshotFunctionality();

setTimeout(function() {
    undoreSaveState(); // Save initial empty statedddfdfd
}, 100);

// ajskfsdddd



});

function eragerPencile(){
        // Canvas setup
        const canvas = document.getElementById('draw');
        const ctx = canvas.getContext('2d');
        
        // Tool elements
        const pencilTool = document.getElementById('pencilTool');
        const eraserTool = document.getElementById('eraserTool');
        
        // Panel elements
        const pencilPanel = document.getElementById('pencilPanel');
        const eraserPanel = document.getElementById('eraserPanel');
        const closePencilPanel = document.getElementById('closePencilPanel');
        const closeEraserPanel = document.getElementById('closeEraserPanel');
        
        // Pencil controls
        const pencilBrushSize = document.getElementById('pencilBrushSize');
        const pencilBrushOpacity = document.getElementById('pencilBrushOpacity');
        const pencilBrushSizePreview = document.getElementById('pencilBrushSizePreview');
        const pencilColorPicker = document.getElementById('pencilColorPicker');
        const pencilColorPreview = document.getElementById('pencilColorPreview');
        
        // Eraser controls
        const eraserBrushSize = document.getElementById('eraserBrushSize');
        const eraserBrushSizePreview = document.getElementById('eraserBrushSizePreview');
        const eraserBrushOpacity = document.getElementById('eraserBrushOpacity');
const eraserBrushOpacityPreview = document.getElementById('eraserBrushOpacityPreview');
        // Drawing state
        
        let lastX = 0;
        let lastY = 0;
        
        
        // Tool settings
        let pencilSettings = {
            size: parseInt(pencilBrushSize.value),
            opacity: parseFloat(pencilBrushOpacity.value),
            color: pencilColorPicker.value
        };
        
        let eraserSettings = {
            size: parseInt(eraserBrushSize.value),
            opacity: parseFloat(eraserBrushOpacity.value)
        };
        
        // Initialize canvas
        function initCanvas() {
            canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            
            // Set initial brush previews
            updatePencilBrushPreview();
            updateEraserBrushPreview();
            updateColorPreview();
        }
        
        // Update pencil brush preview
        function updatePencilBrushPreview() {
            pencilBrushSizePreview.style.width = `${pencilSettings.size}px`;
            pencilBrushSizePreview.style.height = `${pencilSettings.size}px`;
            pencilBrushSizePreview.style.backgroundColor = pencilSettings.color;
            pencilBrushSizePreview.style.opacity = pencilSettings.opacity;
        }
        
        // Update eraser brush preview
        function updateEraserBrushPreview() {
            eraserBrushSizePreview.style.width = `${eraserSettings.size}px`;
            eraserBrushSizePreview.style.height = `${eraserSettings.size}px`;
            eraserBrushSizePreview.style.backgroundColor = '#ffffffff';
            updateEraserOpacityPreview() 
        }
        
        // Update color preview
        function updateColorPreview() {
            pencilColorPreview.style.backgroundColor = pencilSettings.color;
        }
        function updateEraserOpacityPreview() {
    eraserBrushSizePreview.style.opacity = eraserSettings.opacity;
}
        // Position panel above tool
        function positionPanel(panel, tool) {
            const toolRect = tool.getBoundingClientRect();
            const panelRect = panel.getBoundingClientRect();
            
            panel.style.top = `${toolRect.top - panelRect.height - 10}px`;
            panel.style.left = `${toolRect.left}px`;
        }
        
        // Toggle pencil tool
        function togglePencil() {
            if (pencilActive) {
                // Deactivate pencil
                pencilActive = false;
                pencilTool.classList.remove('active');
                canvas.style.cursor = 'default';
                pencilPanel.classList.add('hide');
                document.querySelector("#draw").style.pointerEvents = "none";
            } else {
                // Activate pencil
                pencilActive = true;
                pencilTool.classList.add('active');
                canvas.style.cursor = 'url(\'/assets/images/pencil.png\') 0 24, auto';
                document.querySelector("#draw").style.pointerEvents = "auto";
                // Deactivate eraser if active
                if (eraserActive) {
                    eraserActive = false;
                    eraserTool.classList.remove('active');
                    eraserPanel.classList.add('hide');
                   
                }
                
                // Show pencil panel
                positionPanel(pencilPanel, pencilTool);
                pencilPanel.classList.remove('hide');
            }
        }
        
        // Toggle eraser tool
        function toggleEraser() {
            if (eraserActive) {
                // Deactivate eraser
                eraserActive = false;
                eraserTool.classList.remove('active');
                canvas.style.cursor = 'default';
                eraserPanel.classList.add('hide');
                 document.querySelector("#draw").style.pointerEvents = "none";
            } else {
                // Activate eraser
                eraserActive = true;
                eraserTool.classList.add('active');
                canvas.style.cursor = 'url(\'assets/images/eraser.png\') 12 12, auto';
                 document.querySelector("#draw").style.pointerEvents = "auto";
                // Deactivate pencil if active
                if (pencilActive) {
                    pencilActive = false;
                    pencilTool.classList.remove('active');
                    pencilPanel.classList.add('hide');
                }
                
                // Show eraser panel
                positionPanel(eraserPanel, eraserTool);
                eraserPanel.classList.remove('hide');
            }
        }
       
        // Start drawing
        function startDrawing(e) {
            if (!pencilActive && !eraserActive) return;
            
            isDrawing = true;
            [lastX, lastY] = getCoordinates(e);
            
            // For pencil, start a new path
            if (pencilActive) {
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineWidth = pencilSettings.size;
                ctx.globalAlpha = pencilSettings.opacity;
                ctx.strokeStyle = pencilSettings.color;
                ctx.globalCompositeOperation = 'source-over';
            } else if (eraserActive) {
                ctx.lineWidth = eraserSettings.size;
                ctx.globalAlpha = eraserSettings.opacity;
                ctx.globalCompositeOperation = 'destination-out';
            }
        }
        
        // Draw
        function draw(e) {
            if (!isDrawing || (!pencilActive && !eraserActive)) return;
            
            const [x, y] = getCoordinates(e);
            
            if (pencilActive) {
                ctx.lineTo(x, y);
                ctx.stroke();
            } else if (eraserActive) {
                ctx.beginPath();
                ctx.arc(x, y, eraserSettings.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            [lastX, lastY] = [x, y];
        }
        
        // Stop drawing
        function stopDrawing() {
            isDrawing = false;
            
            if (pencilActive) {
                ctx.closePath();
            }
        }
        
        // Get coordinates from event (mouse or touch)
        function getCoordinates(e) {
            let clientX, clientY;
            
            if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            const rect = canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            
            return [x, y];
        }
        
        // Event listeners for tools
        pencilTool.addEventListener('click', togglePencil);
        eraserTool.addEventListener('click', toggleEraser);
        
        // Close panel buttons
        closePencilPanel.addEventListener('click', () => {
            pencilPanel.classList.add('hide');
            // pencilActive = false;
            // pencilTool.classList.remove('active');
            // canvas.style.cursor = 'default';
        });
        
        closeEraserPanel.addEventListener('click', () => {
            eraserPanel.classList.add('hide');
            // eraserActive = false;
            // eraserTool.classList.remove('active');
            // canvas.style.cursor = 'default';
        });
        
        // Update pencil settings
        pencilBrushSize.addEventListener('input', (e) => {
            pencilSettings.size = parseInt(e.target.value);
            updatePencilBrushPreview();
        });
        
        pencilBrushOpacity.addEventListener('input', (e) => {
            pencilSettings.opacity = parseFloat(e.target.value);
            updatePencilBrushPreview();
        });
        
        pencilColorPicker.addEventListener('input', (e) => {
            pencilSettings.color = e.target.value;
            updatePencilBrushPreview();
            updateColorPreview();
        });
        
        // Update eraser settings
        eraserBrushSize.addEventListener('input', (e) => {
            eraserSettings.size = parseInt(e.target.value);
            updateEraserBrushPreview();
        });
        eraserBrushOpacity.addEventListener('input', (e) => {
    eraserSettings.opacity = parseFloat(e.target.value);
    updateEraserBrushPreview();
});
        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Touch events for mobile support
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrawing(e);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            draw(e);
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopDrawing();
        });
        
        // Initialize the canvas
        initCanvas();
}
// NEW: Screenshot functionality
function initScreenshotFunctionality() {
    $("#screenshot").on("click", function() {
        takeFullPageScreenshot();
    });
}

// // NEW: Take full page screenshot
function takeFullPageScreenshot() {
    // Show processing overlay
    showScreenshotProcessing();
     $(".control-panel").addClass("screenshot-hide");
    // Hide tool container temporarily
    $(".tool-container").addClass("tool-container-hidden");
     $(".secondmenubar").addClass("secondmenubar-hidden");
    
    // Small delay to ensure tool container is hidden before capture
    // setTimeout(function() {
    //     // Remove processing overlay BEFORE capturing
    //     $(".screenshot-processing").remove();
        
    //     // Configure html2canvas options for full page capture
    //     var options = {
    //         backgroundColor: '#ffffff',
    //         scale: 2, // High resolution
    //         logging: false,
    //         useCORS: true,
    //         allowTaint: true,
    //         scrollX: 0,
    //         scrollY: 0,
    //         width: document.documentElement.scrollWidth,
    //         height: document.documentElement.scrollHeight,
    //         windowWidth: document.documentElement.scrollWidth,
    //         windowHeight: document.documentElement.scrollHeight,
    //         onclone: function(clonedDoc) {
    //             // Ensure all images are loaded in the clone
    //             var images = clonedDoc.querySelectorAll('img');
    //             var loadedImages = 0;
    //             var totalImages = images.length;
                
    //             if (totalImages === 0) {
    //                 return Promise.resolve();
    //             }
                
    //             return new Promise(function(resolve) {
    //                 images.forEach(function(img) {
    //                     if (img.complete) {
    //                         loadedImages++;
    //                     } else {
    //                         img.onload = function() {
    //                             loadedImages++;
    //                             if (loadedImages === totalImages) {
    //                                 resolve();
    //                             }
    //                         };
    //                         img.onerror = function() {
    //                             loadedImages++;
    //                             if (loadedImages === totalImages) {
    //                                 resolve();
    //                             }
    //                         };
    //                     }
    //                 });
                    
    //                 // Fallback timeout
    //                 setTimeout(resolve, 100);
    //             });
    //         }
    //     };
        
    //     // Capture the entire body
    //     html2canvas(document.body, options).then(function(canvas) {
    //         // Convert canvas to data URL
    //         var dataURL = canvas.toDataURL("image/png");
            
    //         // Create download link
    //         var link = document.createElement('a');
    //         var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    //         link.download = 'math-tool-screenshot-' + timestamp + '.png';
    //         link.href = dataURL;
            
    //         // Trigger download
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
            
    //         // Restore tool container (no need to remove overlay since we already did)
    //         restoreAfterScreenshot();
            
    //         console.log("Full page screenshot downloaded");
            
    //     }).catch(function(error) {
    //         console.error("Error capturing full page screenshot:", error);
            
    //         // Restore UI even if there's an error
    //         restoreAfterScreenshot();
            
    //         // Fallback: Try simpler capture
    //         try {
    //             // Remove overlay for fallback too
    //             $(".screenshot-processing").remove();
                
    //             html2canvas(document.body, {
    //                 backgroundColor: '#ffffff',
    //                 scale: 1
    //             }).then(function(canvas) {
    //                 var dataURL = canvas.toDataURL("image/png");
    //                 var link = document.createElement('a');
    //                 var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    //                 link.download = 'math-tool-screenshot-' + timestamp + '.png';
    //                 link.href = dataURL;
    //                 document.body.appendChild(link);
    //                 link.click();
    //                 document.body.removeChild(link);
                    
    //                 restoreAfterScreenshot();
    //             });
    //         } catch (fallbackError) {
    //             console.error("Fallback screenshot also failed:", fallbackError);
    //             restoreAfterScreenshot();
    //             alert("Screenshot failed. Please try again.");
    //         }
    //     });
        
    // }, 300); // Wait for tool container to slide out


  setTimeout(function () {
    $(".screenshot-processing").remove();

    const options = {
      backgroundColor: "#ffffff0c",
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 60,
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    };

    html2canvas(document.body, options)
      .then(function (canvas) {
        // ✅ Include the drawing canvas manually
        const drawCanvas = document.getElementById("draw");
        if (drawCanvas) {
          const ctx = canvas.getContext("2d");
          const rect = drawCanvas.getBoundingClientRect();

          // Draw the user's drawing onto the captured canvas
          ctx.drawImage(
            drawCanvas,
            rect.left,
            rect.top,
            rect.width,
            rect.height
          );
        }

        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        link.download = "math-tool-screenshot-" + timestamp + ".png";
        link.href = dataURL;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        restoreAfterScreenshot();
        console.log("Screenshot (with canvas drawing) downloaded ✅");
      })
      .catch(function (error) {
        console.error("Screenshot failed:", error);
        restoreAfterScreenshot();
        alert("Screenshot failed. Please try again.");
      });
  }, 300);
}







// NEW: Show screenshot processing overlay
function showScreenshotProcessing() {
    // Remove any existing overlay
    $(".screenshot-processing").remove();
    
    // Create processing overlay
    var overlay = $('<div class="screenshot-processing"></div>');
    overlay.html(`
        <div class="spinner"></div>
        <div class="message">
            <div>Taking Screenshot...</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">
                Tool panel hidden for clean capture
            </div>
        </div>
    `);
    
    $("body").append(overlay);
    
    // Disable screenshot button during processing
    $("#screenshot").css({
        'opacity': '0.3',
        'pointer-events': 'none'
    });
}

// NEW: Restore UI after screenshot
function restoreAfterScreenshot() {
    // Show tool container
    $(".control-panel").removeClass("screenshot-hide");
    $(".tool-container").removeClass("tool-container-hidden");
    $(".tool-container").addClass("tool-container-visible");
     $(".secondmenubar").removeClass("secondmenubar-hidden");
 $(".secondmenubar").addClass("secondmenubar-visible");

    
    // Remove processing overlay (in case it wasn't removed already)
    $(".screenshot-processing").remove();
    
    // Re-enable screenshot button
    $("#screenshot").css({
        'opacity': '0.6',
        'pointer-events': 'auto'
    });
    
    // Remove visible class after transition
    setTimeout(function() {
        $(".tool-container").removeClass("tool-container-visible");
          $(".secondmenubar").removeClass("secondmenubar-hidden");
           $(".control-panel").removeClass("screenshot-hide");
    }, 40);
}

