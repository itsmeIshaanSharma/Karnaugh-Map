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

// Add at the end of the file
class LogicCircuit {
    constructor(expression) {
        this.expression = expression;
        this.scale = 1;
        this.maxScale = 2;
        this.minScale = 0.5;
    }

    // Add these new methods
    zoomIn() {
        if (this.scale < this.maxScale) {
            this.scale += 0.1;
            this.render('circuitCanvas');
        }
    }

    zoomOut() {
        if (this.scale > this.minScale) {
            this.scale -= 0.1;
            this.render('circuitCanvas');
        }
    }

    render(canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        
        // Calculate dynamic height and width based on number of terms and variables
        const terms = this.expression.split('+').map(term => term.trim());
        const variableCount = this.getUniqueVariables(terms).length;
        const dynamicHeight = Math.max(600, terms.length * 150 + variableCount * 50); // Adjust height
        const dynamicWidth = Math.max(800, variableCount * 100 + terms.length * 50); // Adjust width
        
        canvas.width = dynamicWidth;
        canvas.height = dynamicHeight;
        
        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply scaling
        ctx.save();
        ctx.scale(this.scale, this.scale);
        
        // Draw expression at the top
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(`f(${Array.from(this.getUniqueVariables(terms)).join(',')}) = ${this.expression}`, 50/this.scale, 50/this.scale);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.font = 'bold 18px Arial';
        
        const variables = this.getUniqueVariables(terms);
        
        // Adjust starting Y position to accommodate the expression text
        this.drawCircuit(ctx, terms, variables);
    }

    drawCircuit(ctx, terms, variables) {
        const startX = 100;
        const startY = 150;
        const spacing = 70;
        const gateWidth = 60;
        
        // Draw AND gates and their inputs first
        terms.forEach((term, termIndex) => {
            const gateY = startY + termIndex * spacing * 2;
            const parts = term.match(/[A-Z]'?/g) || [];
            
            // Draw inputs for this term
            parts.forEach((part, inputIndex) => {
                const variable = part.charAt(0);
                const isInverted = part.includes("'");
                const y = gateY - (parts.length - 1) * 20/2 + inputIndex * 20;
                
                // Draw variable name and input line
                ctx.fillText(variable, startX - 30, y + 6);
                
                // Draw horizontal input line
                ctx.beginPath();
                ctx.moveTo(startX, y);
                ctx.lineTo(startX + gateWidth, y);
                ctx.stroke();
                
                // Draw NOT gate if needed
                if (isInverted) {
                    this.drawNOTGate(ctx, startX + gateWidth + 20, y);
                }
                
                // Connect to AND gate with straight lines
                const sourceX = isInverted ? startX + gateWidth + 70 : startX + gateWidth;
                const andX = startX + gateWidth + 180;
                
                // Draw horizontal line
                ctx.beginPath();
                ctx.moveTo(sourceX, y);
                ctx.lineTo(andX - 30, y);
                ctx.stroke();
                
                // Draw vertical line to AND gate
                ctx.beginPath();
                ctx.moveTo(andX - 30, y);
                ctx.lineTo(andX - 30, gateY);
                ctx.lineTo(andX, gateY);
                ctx.stroke();
            });
            
            // Draw AND gate
            this.drawANDGate(ctx, startX + gateWidth + 180, gateY);
            
            // Add term label
            ctx.font = 'bold 16px Arial';
            ctx.fillText(term, startX + gateWidth + 170, gateY - 35);
            ctx.font = 'bold 18px Arial';
        });

        // Draw OR gate if needed
        if (terms.length > 1) {
            const orX = startX + gateWidth + 280;
            const orY = startY + ((terms.length - 1) * spacing);
            
            this.drawORGate(ctx, orX, orY);
            
            // Connect AND gates to OR gate with straight lines
            terms.forEach((_, i) => {
                const andY = startY + i * spacing * 2;
                const andX = startX + gateWidth + 240;
                
                ctx.beginPath();
                ctx.moveTo(andX, andY);
                ctx.lineTo(andX + 20, andY);
                ctx.lineTo(andX + 20, orY);
                ctx.lineTo(orX, orY);
                ctx.stroke();
            });
        }
    }

    getUniqueVariables(terms) {
        const vars = new Set();
        terms.forEach(term => {
            const matches = term.match(/[A-Z]/g);
            if (matches) matches.forEach(v => vars.add(v));
        });
        return Array.from(vars).sort();
    }

    drawNOTGate(ctx, x, y) {
        // Larger NOT gate
        ctx.beginPath();
        ctx.moveTo(x, y - 12);
        ctx.lineTo(x + 24, y);
        ctx.lineTo(x, y + 12);
        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x + 30, y, 6, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawANDGate(ctx, x, y) {
        // Larger AND gate
        ctx.beginPath();
        ctx.moveTo(x, y - 25);
        ctx.lineTo(x + 25, y - 25);
        ctx.arc(x + 25, y, 25, -Math.PI/2, Math.PI/2);
        ctx.lineTo(x, y + 25);
        ctx.closePath();
        ctx.stroke();
    }

    drawORGate(ctx, x, y) {
        // Larger OR gate
        ctx.beginPath();
        ctx.moveTo(x, y - 25);
        ctx.quadraticCurveTo(x + 25, y - 25, x + 50, y);
        ctx.quadraticCurveTo(x + 25, y + 25, x, y + 25);
        ctx.quadraticCurveTo(x + 15, y, x, y - 25);
        ctx.stroke();
    }
}

// Store the current circuit instance
let currentCircuit = null;

// Modify the generateCircuit function
function generateCircuit() {
    let expression = '';
    for (let i = 0; i < Equation.UsedLength; i++) {
        if (i > 0) expression += '+';
        expression += Equation[i].Expression.trim();
    }
    
    currentCircuit = new LogicCircuit(expression);
    currentCircuit.render('circuitCanvas');
}

// Add zoom control event listeners
document.getElementById('zoomIn').addEventListener('click', () => {
    if (currentCircuit) currentCircuit.zoomIn();
});

document.getElementById('zoomOut').addEventListener('click', () => {
    if (currentCircuit) currentCircuit.zoomOut();
});

document.getElementById('generateCircuit').addEventListener('click', generateCircuit);

// Add resize event listener
window.addEventListener('resize', function() {
    const canvas = document.getElementById('circuitCanvas');
    const container = canvas.parentElement;
    
    // Set canvas size based on container
    canvas.width = container.clientWidth;
    canvas.height = Math.max(600, container.clientHeight); // Ensure minimum height
    
    // Redraw circuit if exists
    if (currentCircuit) {
        currentCircuit.render('circuitCanvas');
    }
});

