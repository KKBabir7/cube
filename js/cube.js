 $(document).ready(function () {
    // ✅ Initialize Select2
    $("#cubeTypeSelector").select2({
      placeholder: "Select Cube Type",
      minimumResultsForSearch: Infinity,
      dropdownCssClass: "cube-select-dropdown"
    });

    // ✅ JSONBin configuration
    const BIN_URL = "https://api.jsonbin.io/v3/b/68f3b235ae596e708f1af648";
    const ACCESS_KEY = "$2a$10$eK5ypsmcWaRFGPwUXfH1MOfRduNdtR/6f.ZRb/EcjkVfsgY2jvg2u";
    const MASTER_KEY = "$2a$10$u7Mi.anzXWGXJSSlNcetHOp91wqYtvvmtX7KYz.CbBplCZud7TV0i";

    // ✅ Load cube type from JSONBin
    $.ajax({
      url: `${BIN_URL}/latest`,
      headers: {
        "X-Access-Key": ACCESS_KEY,
        "X-Master-Key": MASTER_KEY
      },
      success: function (res) {
        const cubeType = res.record.cubeType || "kids";
        $("#cubeTypeSelector").val(cubeType).trigger("change");
        changeCubeImages(cubeType);
        
      },
      error: function () {
        changeCubeImages("kids");
      }
    });

    // ✅ When cube type changes
    $("#cubeTypeSelector").on("change", function () {
      const selectedType = $(this).val();
      changeCubeImages(selectedType);
      saveCubeType(selectedType);
      
    });

    // ✅ Change cube images based on type
    function changeCubeImages(type) {
      $(".cube-container-block .cubes").each(function (index) {
        const cubeNum = index + 1;
        let newSrc = "";

        if (type === "raw") newSrc = `assets/images/rawcube/cube${cubeNum}.png`;
        else if (type === "2d") newSrc = `assets/images/cube2d/cube${cubeNum}.png`;
        else newSrc = `assets/images/cube${cubeNum}.png`;

        $(this).find("img:last").attr("src", newSrc);
        
      });
      
    }

    // ✅ Save selected cube type to JSONBin
    function saveCubeType(type) {
      $.ajax({
        url: BIN_URL,
        type: "PUT",
        contentType: "application/json",
        headers: {
          "X-Access-Key": ACCESS_KEY,
          "X-Master-Key": MASTER_KEY
        },
        data: JSON.stringify({ cubeType: type }),
        success: function () {
          console.log("✅ Cube type saved to JSONBin:", type);
          
        },
        error: function (err) {
          console.error("❌ Error saving to JSONBin:", err);
        }
      });
    }
  });