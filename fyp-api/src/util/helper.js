const Helper = {}

Helper.getEquations = (obj1, operator, obj2) => {
 

    switch (operator) {
        case "+":
            return obj1 + obj2
        case "-":
            return obj1 - obj2
        case "==":
            return obj1 == obj2
        case "!=":
            return obj1 != obj2
        case "*":
            return obj1 * obj2
        case "/":
            return obj1 / obj2
        case ">":
            return obj1 > obj2
        case ">=":
            return obj1 >= obj2
        case "<":
            return obj1 < obj2
        case "<=":
            return obj1 <= obj2
        case "%":
            return obj1 % obj2
    }


}

Helper.jsonTryParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
}

Helper.genInsert = (table_name, columns, onDuplicateColumns) => {
    joinedCol = `(\`${columns.join('`,`')}\`)`;
    paras = ` VALUES (${Array(columns.length).fill('?').join(',')})`;
    ondup = onDuplicateColumns ? " ON DUPLICATE KEY UPDATE " + onDuplicateColumns.map(el => `\`${el}\` = VALUES(\`${el}\`)`).join(',') : '';
    return `INSERT INTO \`${table_name}\` ` + joinedCol + paras + ondup;
}

Helper.genMultiRowInsert = (table_name, columns, onDuplicateColumns) => {
    joinedCol = `(\`${columns.join('`,`')}\`)`;
    paras = ` VALUES ?`;
    ondup = onDuplicateColumns ? " ON DUPLICATE KEY UPDATE " + onDuplicateColumns.map(el => `\`${el}\` = VALUES(\`${el}\`)`).join(',') : '';
    return `INSERT INTO \`${table_name}\` ` + joinedCol + paras + ondup;
}

Helper.genUpdate = (table_name, columns) => {
    joinedCol = `\`${columns.join('`=?,`')}\`=?`;
    return `UPDATE \`${table_name}\` SET ` + joinedCol;
}

Helper.operators = {
    '+': (v1, v2) => parseFloat(v1) + parseFloat(v2),
    '-': (v1, v2) => parseFloat(v1) - parseFloat(v2),
    '*': (v1, v2) => parseFloat(v1) * parseFloat(v2),
    '/': (v1, v2) => parseFloat(v1) / parseFloat(v2),
    '^': (v1, v2) => Math.pow(parseFloat(v1), parseFloat(v2)),
    '%': (v1, v2) => parseFloat(v1) % parseFloat(v2),
    '==': (v1, v2) => parseFloat(v1) == parseFloat(v2),
    '!=': (v1, v2) => parseFloat(v1) != parseFloat(v2),
    '>': (v1, v2) => parseFloat(v1) > parseFloat(v2),
    '>=': (v1, v2) => parseFloat(v1) >= parseFloat(v2),
    '<': (v1, v2) => parseFloat(v1) < parseFloat(v2),
    '<=': (v1, v2) => parseFloat(v1) <= parseFloat(v2)
  }

module.exports = Helper