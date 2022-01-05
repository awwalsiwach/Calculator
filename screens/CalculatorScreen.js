require("./../lib/swisscalc.lib.format.js");
require("./../lib/swisscalc.lib.operator.js");
require("./../lib/swisscalc.lib.operatorCache.js");
require("./../lib/swisscalc.lib.shuntingYard.js");
require("./../lib/swisscalc.calc.calculator.js");
require("./../lib/swisscalc.display.memoryDisplay.js");
require("./../lib/swisscalc.display.numericDisplay.js");

import React from "react";
import { StyleSheet, PanResponder, Dimensions, View, Text } from "react-native";
import { CalcButton , CalcDisplay } from "./../components";

export default class CalculatorScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: "0",
      orientation: "portrait"
    };

    this.oc = global.swisscalc.lib.operatorCache;
    this.calc = new global.swisscalc.calc.calculator();

    Dimensions.addEventListener("change", () => {
      const { width, height } = Dimensions.get("window");
      var orientation = ( width > height ) ? "landscape" : "portrait";
      this.setState({ orientation: orientation });
    });

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => { },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) >= 50) {
          this.onBackspacePress();
        }
      },
    })
  }

  onBackspacePress = () => {
    this.calc.backspace();
    this.setState({ display: this.calc.getMainDisplay()});
  }

  onDigitPress = (digit) => {
    this.calc.addDigit(digit);
    this.setState({ display: this.calc.getMainDisplay()});
  }

  onClearPress = () => {
    this.calc.clear();
    this.setState({ display: this.calc.getMainDisplay()});
  }

  onPlusMinusPress = () => {
    this.calc.negate();
    this.setState({ display: this.calc.getMainDisplay()});
  }

  onBinaryOperatorPress = (operator) => {
    this.calc.addBinaryOperator(operator);
    this.setState({ display: this.calc.getMainDisplay()});
  }

  onEqualPress = () => {
    this.calc.equalsPressed();
    this.setState({ display: this.calc.getMainDisplay()});
  }

  onUnaryOperatorPress = (operator) => {
    this.calc.addUnaryOperator(operator);
    this.setState({ display: this.calc.getMainDisplay()});
  }

  renderPortrait() {
    return (
      <>
      <View style={styles.displayContainer} {...this.panResponder.panHandlers}>
          <CalcDisplay display={this.state.display}/>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <CalcButton onPress={this.onClearPress} title="C" color="#ECF0F1" backgroundColor="#5F6A7C" />
            <CalcButton onPress={this.onPlusMinusPress} title="+/-" color="#ECF0F1" backgroundColor="#5F6A7C" />
            <CalcButton onPress={() => {this.onUnaryOperatorPress(this.oc.PercentOperator)}} title="%" color="#ECF0F1" backgroundColor="#5F6A7C" />
            <CalcButton onPress={() => {this.onBinaryOperatorPress(this.oc.DivisionOperator) }} title="/" color="#ECF0F1" backgroundColor="#df8620" />
          </View>

          <View style={styles.buttonRow}>
            <CalcButton onPress={() => {this.onDigitPress("7") }} title="7" color="#ECF0F1" backgroundColor="#2c3240" />
            <CalcButton onPress={() => {this.onDigitPress("8") }} title="8" color="#ECF0F1" backgroundColor="#2c3240" />
            <CalcButton onPress={() => {this.onDigitPress("9") }} title="9" color="#ECF0F1" backgroundColor="#2c3240" />
            <CalcButton onPress={() => {this.onBinaryOperatorPress(this.oc.MultiplicationOperator) }} title="X" color="#ECF0F1" backgroundColor="#df8620" />
          </View>

          <View style={styles.buttonRow}>
            <CalcButton onPress={() => {this.onDigitPress("4") }} title="4" color="#ECF0F1" backgroundColor="#2c3240" />
            <CalcButton onPress={() => {this.onDigitPress("5") }} title="5" color="#ECF0F1" backgroundColor="#2c3240" />
            <CalcButton onPress={() => {this.onDigitPress("6") }} title="6" color="#ECF0F1" backgroundColor="#2c3240" />
            <CalcButton onPress={() => {this.onBinaryOperatorPress(this.oc.SubtractionOperator) }} title="-" color="#ECF0F1" backgroundColor="#df8620" />
          </View>

          <View style={styles.buttonRow}>
            <CalcButton onPress={() => {this.onDigitPress("1") }} title="1" color="#ECF0F1" backgroundColor="#2c3240" />
            <CalcButton onPress={() => {this.onDigitPress("2") }} title="2" color="#ECF0F1" backgroundColor="#2c3240" />
            <CalcButton onPress={() => {this.onDigitPress("3") }} title="3" color="#ECF0F1" backgroundColor="#2c3240" />
            <CalcButton onPress={() => {this.onBinaryOperatorPress(this.oc.AdditionOperator) }} title="+" color="#ECF0F1" backgroundColor="#df8620" />
          </View>

          <View style={styles.buttonRow}>
            <CalcButton onPress={() => {this.onDigitPress("0") }} title="0" color="#ECF0F1" backgroundColor="#2c3240" style={{flex:2}} />
            <CalcButton onPress={() => {this.onDigitPress(".") }} title="." color="#ECF0F1" backgroundColor="#2c3240" />
            <CalcButton onPress={this.onEqualPress} title="=" color="#ECF0F1" backgroundColor="#df8620" />
          </View>
        </View>
        </>
    );
  }

  renderLandscape() {
    return(
      <View style={{flex:1 , paddingTop: 50}}>
        <Text>Landscape Mode</Text>
      </View>
    );
  }

  render() {
    var view = (this.state.orientation == "portrait")
    ? this.renderPortrait()
    : this.renderLandscape();

    return (
      <View style={styles.container}>
        {view}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: "#303642",},
  displayContainer: {flex: 1, justifyContent: "flex-end"},
  buttonContainer: {paddingBottom: 20, paddingRight: 10, paddingLeft: 10 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between"},
});