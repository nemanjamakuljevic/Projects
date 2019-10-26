//BUDGET controller
var budgetController = (function(){
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calcTotals = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curElement){
            sum += curElement.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 //if there is no inc or exp percentage isnt existent
    };

    return {
        addItem: function(type,des,val){
            var newItem, ID;

            // [1,2,5,6,9]
            //ID = last ID + 1
            //create new id
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            //create new item based on type 
            if(type === 'exp'){
                newItem = new Expense(ID,des,val);
            }else if(type === 'inc'){
                newItem = new Income(ID,des,val);
            }
            // store it in data
            data.allItems[type].push(newItem);
            //return new element
            return newItem;
        },

        calcBudget : function(){
            //calc inc and exp
            calcTotals('exp');
            calcTotals('inc');
            //calc budget
            data.budget = data.totals.inc - data.totals.exp;
            //% of income we spent
            if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) *100);
            }else{
                data.percentage = -1;
            }
        },

        calcPercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        deleteItem: function(type,id){
            var ids, index;
           ids = data.allItems[type].map(function(current){ //loop over 
                return current.id;
            });
            index = ids.indexOf(id);

            if(index !== -1){
                //deliting from array
                data.allItems[type].splice(index, 1);
            }
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget : function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing : function(){
            console.log(data);
        }
    };


})();

//UI controller
var UICOntroller = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__title',
        budgetLable: '.budget__value',
        incomeLable: '.budget__income--value',
        expensesLable: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container',
        expPercLable: '.item__percentage',
        dateLable: '.budget__title--month'
    };

    var formatNumber = function(num, type){
        // + or - 
        // 2 decimal 
        // . separator for over 1000
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        ;
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
     };

      //creating own forEach for lists
      var nodeListForEach = function(list, callBack){
        for(var i =0; i < list.length; i++ ){
            callBack(list[i], i);
        }
    };

    return {
        getInput : function(){
            return{
             type: document.querySelector(DOMstrings.inputType).value,
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem : function(obj,type){
            var html, newHtml, element;
            //create html string with place holder
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //replace placeholder with data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value, type));

            //insert html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectedID){
            var element = document.getElementById(selectedID);
            //removing element DOM
            element.parentNode.removeChild(element);
        },

        clearFields : function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', '
            + DOMstrings.inputValue);

            //translate list into array
            fieldsArr = Array.prototype.slice.call(fields); // slice is returnig section of an array

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";                
            });

            fieldsArr[0].focus();
        },

        displayBudget : function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLable).textContent =formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLable).textContent =formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLable).textContent =formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLable).textContent = '-';
            }
        },

        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expPercLable);

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '-';
                }
            });
        },

        displayMonth: function(){
            var now, year, months, month;
            now = new Date();

            months = ['January', 'February','March','April','May','June','July','August','September','October','November','December']
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLable).textContent = months[month] + ' ' + year;
        },

        changedType: function(){
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );
            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOMstrings : function(){
            return DOMstrings;
        }

    };

})();

// APP controller
var controller = (function(budgetCT,UICT){
    var DOM = UICOntroller.getDOMstrings();

    var setupEventListeners = function(){
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.keyCode === 13 || event.which === 13){ //which for older browsers
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICT.changedType);
    };

    var updateBudget = function(){
        //1. Calck budget
        budgetCT.calcBudget();
        //2. Return budget
        var budget = budgetCT.getBudget();
        //3. Display budget
        UICT.displayBudget(budget);
    };

    var updatePercentages = function(){
        //1 calc percentages
        budgetCT.calcPercentages();
        //2 read id from budgetcontroller
        var percentages = budgetCT.getPercentages();
        //3 update UI
        UICT.displayPercentages(percentages);
    };

    var ctrlAddItem = function(){
        var input, newItem;
        //1. Get input
        input = UICT.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //2. Add item to budget controller
        var newItem = budgetCT.addItem(input.type, input.description, input.value);

        //3. Add item to UI
        UICT.addListItem(newItem, input.type);
        //3.1 Clear fields
        UICT.clearFields();
        //4 Calc and update budget
        updateBudget();
        //5 Calc percentage and update
        updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1 delete item from data
            budgetCT.deleteItem(type, ID);
            //2 delete item from UI
            UICT.deleteListItem(itemID);
            //3 update and display new budget
            updateBudget();
            //4 update and display percentages
            updatePercentages();
        }
    };

    return{
        init: function(){
            console.log('App start');
            UICT.displayMonth();
            UICT.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }

    };

  
})(budgetController,UICOntroller);

controller.init();