function LIFE() {
    this.height = 15;
    this.width = 15;
    this.select = "tdSelect";
    this.noSelect = "tdFree";
    this.idWidth = "width";
    this.idHeight = "height";
    this.idStart = "start";
    this.idStop = "stop";
    this.idClear = "clear";
    this.idCreate = "create";
    this.idSlider = "slider-vertical";
    this.idValue = "value";
    this.idMainTable = "mainTable";
    this.sliderMin = 0;
    this.sliderMax = 2000;
    this.table = "";
    this.delay = 1000;
    this.start = false;
    this.matrix = [];
    this.idInterval = null;

    this.init = function () {
        jQuery("#" + this.idWidth).val(this.width);
        jQuery("#" + this.idHeight).val(this.height);

        this.matrix = new Array(this.height);
        for (var i = 0; i < this.height; i++) {
            this.matrix[i] = new Array(this.width);
        }
        jQuery("#" + this.idValue).text(this.delay);
        this.createTable();
        this.stop();
        this.wait(this);
    };

    this.createTable = function () {
        this.table = "<table>";
        for (var i = 0; i < this.height; i++) {
            this.table += "<tr>";
            for (var j = 0; j < this.width; j++) {
                this.table += "<td></td>";
                this.matrix[i][j] = false;
            }
            this.table += "</tr>";
        }
        this.table += "</table>";
        jQuery("#" + this.idMainTable).append(jQuery(this.table));
    };

    this.calculate = function () {
        var tempMatrix = new Array(this.height);
        for (var i = 0; i < this.height; i++) {
            tempMatrix[i] = new Array(this.width);
            for (var j = 0; j < this.width; j++) {
                var c = this.count(i, j);
                tempMatrix[i][j] = c == 3 || (this.matrix[i][j] == 1 && c == 2);
            }
        }


        this.matrix = tempMatrix;
    };

    this.clear = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.matrix[i][j] = false;
            }
        }
        this.paint();
        this.stop();
    };

    this.create = function () {
        this.height = parseInt(jQuery("#" + this.idHeight).val());
        this.width = parseInt(jQuery("#" + this.idWidth).val());
        jQuery("#" + this.idMainTable).html("");
        delete this.matrix;
        this.init();
    };

    this.count = function (ii, jj) {
        var temp = 0;

        if (this.matrix[(this.height + ii - 1) % this.height][(this.width + jj - 1) % this.width]) {
            temp++;
        }
        if (this.matrix[ii][(this.width + jj - 1) % this.width]) {
            temp++;
        }
        if (this.matrix[(this.height + ii - 1) % this.height][(this.width + jj + 1) % this.width]) {
            temp++;
        }
        if (this.matrix[ii][(this.width + jj + 1) % this.width]) {
            temp++;
        }
        if (this.width && this.matrix[(this.height + ii + 1) % this.height][(this.width + jj + 1) % this.width]) {
            temp++;
        }
        if (this.matrix[(this.height + ii + 1) % this.height][jj]) {
            temp++;
        }
        if (this.matrix[(this.height + ii + 1) % this.height][(this.width + jj - 1) % this.width]) {
            temp++;
        }
        if (this.matrix[(this.height + ii - 1) % this.height][jj]) {
            temp++;
        }
        return temp;
    };

    this.paint = function () {

        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var tr = jQuery("#" + this.idMainTable + " table tr").eq(i);
                var td = jQuery("td", tr).eq(j);
                if (this.matrix[i][j]) {
                    jQuery(td).addClass(this.select);
                    jQuery(td).removeClass(this.noSelect);
                } else {
                    jQuery(td).addClass(this.noSelect);
                    jQuery(td).removeClass(this.select);
                }
            }
        }
    };

    this.stop = function () {
        this.start = false;
        clearInterval(this.idInterval);
        jQuery("#" + this.idStart).prop('disabled', false);
        jQuery("#" + this.idClear).prop('disabled', false);
        jQuery("#" + this.idCreate).prop('disabled', false);
        jQuery("#" + this.idStop).prop('disabled', true);
    };
    this.play = function () {
        if (this.idInterval != null) {
            clearInterval(this.idInterval);
        }
        this.start = true;
        this.idInterval = setInterval(this.run, this.delay);
        jQuery("#" + this.idStart).prop('disabled', true);
        jQuery("#" + this.idClear).prop('disabled', true);
        jQuery("#" + this.idCreate).prop('disabled', true);
        jQuery("#" + this.idStop).prop('disabled', false);
    };


    this.wait = function (parent) {
        jQuery("#" + parent.idStart).click(function () {
            parent.play();
        });


        jQuery("#" + parent.idStop).click(function () {
            parent.stop();
        });
        jQuery("#" + parent.idClear).click(function () {
            parent.clear();
        });

        jQuery("#" + parent.idCreate).click(function () {
            parent.create();
        });


        this.run = function () {
            if (parent.start) {
                parent.calculate();
                parent.paint();
            }
        };

        jQuery("#" + parent.idSlider).slider({
            orientation: "vertical",
            min: parent.sliderMin,
            max: parent.sliderMax,
            value: parent.delay,
            change: function (event, ui) {
                jQuery("#" + parent.idValue).text(ui.value);
                var isStart = false;
                if (parent.start) {
                    isStart = parent.start;
                }
                parent.stop();
                parent.delay = ui.value;

                if (isStart) {
                    parent.play();
                }

            }
        });

        jQuery("#" + parent.idMainTable + " td").click(function () {
            var col = $(this).parent().children().index($(this));
            var row = $(this).parent().parent().children().index($(this).parent());
            if (jQuery(this).hasClass(parent.select)) {
                jQuery(this).addClass(parent.noSelect);
                jQuery(this).removeClass(parent.select);
                parent.matrix[row][col] = false;
            } else {
                jQuery(this).addClass(parent.select);
                jQuery(this).removeClass(parent.noSelect);
                parent.matrix[row][col] = true;
            }
        })
    };
}
