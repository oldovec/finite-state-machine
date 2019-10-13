class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) throw new Error('config isn\'t passed');
        this.initialState = config.initial;
        this.currentState = config.initial;
        this.config = config.states;

        this.history = [this.currentState];
        this.historyIndex = 0;
    }

    setHistoryIndex(state) {
        this.history.splice(this.historyIndex + 1);
        this.history.push(state);
        this.historyIndex++;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (state in this.config) {
            this.setHistoryIndex(state);
            return this.currentState = state;
        } else {
            throw new Error('state isn\'t exist');
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (event in this.config[this.currentState]['transitions']) {
            this.currentState = this.config[this.currentState]['transitions'][event];
            this.setHistoryIndex(this.currentState);
            return this.currentState;
        } else {
            throw new Error('state isn\'t exist');
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        return this.currentState = this.initialState;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let states = Object.keys(this.config);
        if (event) {
            states = states.filter((state) => event in this.config[state]['transitions']);
        }
        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this.historyIndex) return false;
        this.historyIndex--;
        this.currentState = this.history[this.historyIndex];
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.historyIndex >= this.history.length - 1) return false;
        this.historyIndex++;
        this.currentState = this.history[this.historyIndex];
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.historyIndex = 0;
    }
}

module.exports = FSM;
