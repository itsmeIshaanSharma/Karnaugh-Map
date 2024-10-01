document.getElementById('equation').addEventListener('keydown', function(event) {
    const key = event.key;
    const allowedKeys = ["!", "'", 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'b', 'c', 'd', 'A', 'B', 'C', 'D', 'Backspace','Enter','+'];
    if (!allowedKeys.includes(key)) {
        event.preventDefault();
    }
});
function CountVar(s) {
    var chars = {},
        rv = '';
    var s = s.replace(/[^a-zA-Z]/g, "");

    for (var i = 0; i < s.length; ++i) {
        if (!(s[i] in chars)) {
            chars[s[i]] = 1;
            rv += s[i];
        }
    }

    return rv.length;
}
function replaceVar(expression) {

    for (var i = 0; i < TruthTable.length; i++) {

        string = expression.replace(/a/g, TruthTable[i][0].Variable);
        string = string.replace(/b/g, TruthTable[i][1].Variable);
        string = string.replace(/c/g, TruthTable[i][2].Variable);
        string = string.replace(/d/g, TruthTable[i][3].Variable);
        if (eval(string) > 0) {
            document.getElementById(TruthTable[i].ButtonUIName).click();
        }

    };

}
document.getElementById('equation').addEventListener('change', function() {
    if (isNaN(this.value)) {
        var strlower = this.value.toLowerCase();
        var varNum = (CountVar(this.value));


        var func = strlower.split("+");
        for (var i = 0; i < func.length; i++) {

            func[i] = func[i].trim();
            func[i] = func[i].split(/([a-z])/).join("&").replace("&", "").split("&&").join("&").split("&!&").join("&!");
            func[i] = func[i].substr(0, (func[i].length - 1));
        };

        strlower = func.join(" | ");

        switch (varNum) {
            case 4:
                document.getElementById('FourVariableRB').click();
                replaceVar(strlower);
                break;

            case 3:
                document.getElementById('ThreeVariableRB').click();
                replaceVar(strlower);
                break;

            default:
                if (varNum < 3) {

                    document.getElementById('TwoVariableRB').click();
                    replaceVar(strlower);

                } else if (varNum > 4) {
                    alert("Invalid input");
                };
        }

    } else {

    }

});

