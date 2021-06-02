<script type="text/javascript" src="https://www.evga.com/includes/js/jquery/jquery-3.6.0.min.js"></script>
<script type="text/javascript" src="https://www.evga.com/includes/js/jquery/jquery-migrate-3.3.2.min.js"></script>
<script type="text/javascript" src="https://www.evga.com/includes/js/jquery-ui/jquery-ui.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>
$(document).ready(function () {
        $('.main-wrapper').before($('.nav-breadcrumb'));
        if ($('.grid-item-outer').length > 0) {
            var blank_columns = 3 - ($('.grid-item-outer').length % 3);
            for (i = 0; i < blank_columns; i++) {
                $('.table-gridview').append('<div class="grid-item-outer blank"></div>');
            }
        }
        $.fn.extend({
            setCookie: function (cookieName, cookieVal) {
                var dt = new Date();
                dt.setDate(dt.getDate() + 365 * 36);
                $.cookie(cookieName, cookieVal, { path: '/', expires: dt });
            },
            clsCookie: function (cookieName) {
                $.cookie(cookieName, null);
            }
        });
        initCompareList();

        $telerik.$('.groupButton').click(function () {
            if ($('.groupButton').hasClass("clicked")) {
                $(".groupButton").removeClass("clicked");
                $(this).addClass("clicked");
            } else {
                $(this).addClass("clicked");
            }
            var classes = $telerik.$(this).attr('class');
            var array = classes.split(" ");
            var selector = (typeof ($telerik.$(this).attr('id')) !== 'undefined' || $telerik.$(this).attr('id') !== null) ? '#' + $telerik.$(this).attr('id') : '.' + $telerik.$(this).attr('class');
            var timeout = 200;
            $telerik.$('.pnlGridView').css('min-height', '400px');
            $telerik.$('.group-container').stop();
            $telerik.$('.group-container').fadeOut(timeout);
            setTimeout(function () { $telerik.$('.' + array[1] + '-container').fadeIn(timeout); $telerik.$('.pnlGridView').css('min-height', ''); }, timeout);
        });
        $telerik.$('.backtotop').click(function () {
            var timeout = 200;
            $telerik.$('.group-container').stop();
            $telerik.$('.group-container').fadeOut(timeout);
            setTimeout(function () { $telerik.$('.group-container').fadeIn(timeout); }, timeout);
        });
    });
    function pageLoad() {
        $('#ctl00_LFrame_prdList_tblSearchMain a[title!=""]').each(function () {
            $(this).hover(function () {
                $(this).css('color', '#777');
            }, function () {
                $(this).css('color', '#000000');
            }
            );
            $(this).css('color', '#000000');
        });

        if (location.href.indexOf("&ShowAdvMark=") > -1) showAdvanced();
        var w = $('body').innerWidth();
        var _w = Math.round(w * 0.9);
        var _left = $(".bodyLeftArea").css("width");
        if (_left != undefined)
            $("#cont").css("width", _w - _left.replace("px", "") + "px");
    }
    function initCompareList() {
        $("input[type=checkbox]:checked").each(
            function () {
                if (this.name.indexOf("chkOnlyInStock") < 0)
                    this.checked = false;
            }
        );
        var str = $.cookie('EVGA_ComparePrd');
        if (str == "undefined") {
            $(document).setCookie('EVGA_ComparePrd', "");
            str = "";
        }
        setCompareList(str);
    }
    function canCompare() {
        var str = $.cookie('EVGA_ComparePrd');
        if (str != null)
            goPage("/products/Compare.aspx");
        return str != null;
    }
    function goCompare(pn, tn) {
        if (!addCompareItem(pn, tn))
            return false;

        if ($('input[name$="hidCompareItem"]').val() < 2) {
            alert("You may select at least 2 items for comparison.");
            return false;
        }

        goPage("/products/Compare.aspx");
        return true;
    }
    function addclsItem(pn, tn, ctl) {
        if (ctl.checked)
            return addCompareItem(pn, tn);
        else
            return removeCompareItem(pn, tn);
    }
    function addCompareItem(pn, tn) {
        if ($('input[name$="hidCompareItem"]').val() == 5) {
            alert("You may select only up 5 items at a time to compare.");
            return false;
        }
        var str = $.cookie('EVGA_ComparePrd');
        var newStr = "|EVGA" + pn;

        /* set grouping cookie */
        var grp = $.cookie('EVGA_GroupPrd');

        if (grp != null && grp != '') {
            if (grp != tn) {
                alert("You cannot compare this item with your current compare selection. Please remove the items in your selection if you wish to compare from this family.");
                return false;
            }
        }

        $(document).setCookie('EVGA_GroupPrd', tn);

        if (str != null) {
            newStr = str + newStr;
        }
        $(document).setCookie('EVGA_ComparePrd', newStr);
        setCompareList(newStr);
        return true;
    }
    function removeCompareItem(pn) {
        var str = $.cookie('EVGA_ComparePrd');
        var oldLen = str.replace(/EVGA/g, "").split('|').length - 1;
        if (str != null) {
            var newStr = str.replace("EVGA" + pn + "|", "").replace("|EVGA" + pn, "").replace("EVGA" + pn, "").replace("||", "|");
            setCompareList(newStr);
            $(document).setCookie('EVGA_ComparePrd', newStr);
            clsCompareItem(oldLen);
            $('input[name$="hidCompareItem"]').val(newStr.split('|').length - 1);
            $('#' + pn).prop('checked', false);

            if (newStr == '') $(document).setCookie('EVGA_GroupPrd', '');
        }
        else {
            $(document).setCookie('EVGA_GroupPrd', '');
        }

        return true;
    }
    function setCompareList(str) {
        if (str != null && str.toString().length > 0) {
            var list = str.replace(/EVGA/g, "").split('|');
            var i = 1;
            for (var key in list) {
                if (list[key].length == 0) continue;
                if (i > 5) break;
                clsCompareItem(i);
                setCompare(i, list[key]);
                $('#' + list[key]).prop('checked', true);
                ++i;
            }
            $('input[name$="hidCompareItem"]').val(i - 1);
        }
    }
    function clsCompareItem(intIndex) {
        $("#li" + intIndex).find("span").remove();
        $("#compare" + intIndex).find("img").remove();
        $("#compare" + intIndex).css("title", "").css("cursor", "default");
    }
    function removeCompare(intIndex) {
        var pn = $("#compare" + intIndex).find("img.compareImg").attr("alt");
        if (pn != undefined) {
            removeCompareItem(pn);
        }
    }
    function setCompare(intIndex, pn) {
        var div = $("#compare" + intIndex);
        var img2 = $("<img>").attr("src", "https://images.evga.com/products/gallery/" + pn + "_sm_1.jpg").attr("alt", pn).addClass("compareImg");
        div.append(img2);
        var imgOver = $("<img>").attr("src", "/products/App_Themes/images/compare_box_active.png").attr("alt", "Remove Item").attr("title", "Remove Item").addClass("compare-hover");
        div.append(imgOver);
        div.css("cursor", "pointer").css("title", "Remove Item");
    }
    function replaceCtl(ctl, urlParam) {
        var strParam = "&" + urlParam + "=";
        var o = $('input:hidden[name$="' + ctl + '"]').val();
        if (o == "") return;
        $(".SearchMainCont a").each(function (i) {
            var link = $(this).attr("onclick");
            var loAryM = link.toString().split(strParam);
            var loAryD = loAryM[1].split("&");
            loAryD[0] = o;
            loAryM[1] = loAryD.join("&");
            var newClick = new Function(loAryM.join(strParam).split("{")[1].replace("}", ""));

            $(this).attr("onclick", "").click(newClick);
        });
        if ($(".btnOn").length > 0) {
            var link = $(".btnOn").attr("onclick");
            var loAry = link.toString().split("\n")[2].split(strParam);
            loAry[1] = o;
            var newClick = new Function(loAry.join(strParam) + "')");

            $(".btnOn").attr("onclick", "").click(newClick);
        }
    }
    function replaceOrder() {
        replaceCtl("lblOrder", "Order");
    }
    function replaceOnly() {
        replaceCtl("lblOnlyIn", "Only");
    }
    function strAdv() {
        var t = $('input:hidden[name$="lblProductType"]').val();
        var f = $('input:hidden[name$="lblFamily"]').val();
        var c = $('input:hidden[name$="lblChipset"]').val();
        var o = $('input:hidden[name$="lblOrder"]').val();
        var oi = $('input:hidden[name$="lblOnlyIn"]').val();
        if (t == "" && f == "" && c == "")
            return "";
        srcParam = "/products/productlist.aspx?type=" + encodeURIComponent(t);
        if (f != "") srcParam += "&family=" + encodeURIComponent(f);
        if (c != "") srcParam += "&Chipset=" + encodeURIComponent(c);
        if (o != "") srcParam += "&Order=" + encodeURIComponent(o);
        if (oi != "") srcParam += "&Only=" + encodeURIComponent(oi);
        return srcParam;
    }
    function dropAdv(obj) {

        var a = $('input:hidden[name$="lblAdv"]').val();

        srcParam = strAdv();
        if (srcParam == "" && a == "")
            return;

        if (a == "") {
            location.href = srcParam;
            return;
        }
        var aryObj = obj.split("+");
        for (i = 0; i < aryObj.length; i++) {
            a = a.replace(aryObj[i], "");
        }
        if (a.substring(0, 1) == "+")
            a = a.substring(1, a.length);

        if (a.charAt(a.length - 1) == "+")
            a = a.substring(0, a.length - 1);
        if (a != "")
            srcParam += "&Adv=" + encodeURIComponent(a);
        location.href = srcParam;
    }
    function showGuided() {
        $("#nav").css("background-position", "0 0");
        $("#spnGuided").css("display", "block");
        $('#spnAdvanced').css("display", "none");
    }
    function showAdvanced() {
        $("#nav").css("background-position", "0 -30px");
        $("#spnGuided").css("display", "none");
        $('#spnAdvanced').css("display", "block");
    }
    function advSearch() {
        var t = $('select[name$="advUseful"]').val();
        var m = $('select[name$="advPrice"]').val();
        srcParam = strAdv();
        var a = $('input:hidden[name$="lblAdv"]').val();
        if (srcParam == "") return false;
        if (t != "" || m != "") {
            if (a != "")
                srcParam += "&Adv=" + a;
            if (t != "") {
                if (srcParam.indexOf("&Adv") > -1 && t != "")
                    srcParam += encodeURIComponent("+" + t);
                else
                    srcParam += "&Adv=" + encodeURIComponent(t);
            }
            if (m != "") {
                if (srcParam.indexOf("&Adv") > -1 && m != "")
                    srcParam += encodeURIComponent("+" + m);
                else
                    srcParam += "&Adv=" + encodeURIComponent(m);
            }
            srcParam += "&ShowAdvMark=";
            location.href = srcParam;
            return true;
        } else
            return false;
    }

    function openEliteWindow(pn) {
        var wnd = window.radopen("/products/notify_elite.aspx?pn=" + pn, "notify");
        wnd.set_behaviors(Telerik.Web.UI.WindowBehaviors.Move | Telerik.Web.UI.WindowBehaviors.Close);
        wnd.setSize(800, 400);
        wnd.center();
        var args = new Object();
        wnd.argument = args;
    }

    function openAutoNotifyWin(pn) {
        var wnd = window.radopen("autoNotify.aspx?pn=" + pn + "&CsrfToken=04b300f0-8d3c-406f-8996-47b82a3393e6", "OnhandWin");
        wnd.set_behaviors(Telerik.Web.UI.WindowBehaviors.Move);
        wnd.set_modal(true);
        var args = new Object();
        wnd.argument = args;
    }

    function openPicWin(pn) {
        var wnd = window.radopen("/products/PicDialog.aspx?pn=" + pn, "priceincart");
        wnd.set_behaviors(Telerik.Web.UI.WindowBehaviors.Move);
        var args = new Object();
        wnd.argument = args;
    }

    function openAssociateWin(pn) {
        var wnd = window.radopen("/products/AssociateDialog.aspx?pn=" + pn, "Associate Purchase");
        wnd.set_behaviors(Telerik.Web.UI.WindowBehaviors.Move);
        wnd.setSize(800, 400);
        wnd.center();
        var args = new Object();
        wnd.argument = args;
    }

    function OnClientClose(sender, args) {
        var arg = args.get_argument();
        if (arg) {
            var iCell = sender.argument.Cell;
            var iRegion = sender.argument.Region;
            var iType = arg.Type;
            var iAlert = arg.AlertType;
            if (iType == "Alert") {
                var iLevel = arg.AlertLevel;
                if (iAlert == "Chipset")
                    iCell.style.setAttribute("backgroundColor", "red");
                else
                    iCell.style.setAttribute("color", "red");
                iCell.title = iLevel + " in [" + iRegion + "] ";
            }
            else {
                if (iAlert == "Chipset")
                    iCell.style.setAttribute("backgroundColor", "black");
                else
                    iCell.style.setAttribute("color", "black");
                iCell.title = "";
            }
        }
    }
