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
        let string = expression;
        
        // Handle variable replacements based on truth table
        for (let j = 0; j < VariableCount; j++) {
            const varName = String.fromCharCode(97 + j); // a, b, c, d
            if (TruthTable[i][j]) {
                const value = TruthTable[i][j].Variable ? "1" : "0";
                string = string.replace(new RegExp(varName, 'g'), value);
            }
        }
        
        // Handle NOT operations and logical operators
        string = string.replace(/(\d)'|!(\d)/g, (match, p1, p2) => {
            const num = p1 || p2;
            return num === "1" ? "0" : "1";
        });
        string = string.replace(/&/g, "&&");
        string = string.replace(/\|/g, "||");
        
        try {
            if (eval(string)) {
                document.getElementById(TruthTable[i].ButtonUIName).click();
            }
        } catch (e) {
            console.error("Error evaluating:", string, e);
        }
    }
}

document.getElementById('equation').addEventListener('change', function() {
    if (isNaN(this.value)) {
        var strlower = this.value.toLowerCase();
        var varNum = CountVar(this.value);

        // Improved expression parsing
        var func = strlower.split("+").map(term => {
            term = term.trim();
            // Handle NOT operations and combine terms
            return term.split(/([a-z]'?)/)
                .filter(Boolean)
                .map(part => part.replace(/'$/, "'"))
                .join("&")
                .replace(/^&|&$/g, "")
                .replace(/&&/g, "&");
        });

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

