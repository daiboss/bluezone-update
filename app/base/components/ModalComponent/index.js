import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

class ModalComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (Platform.OS == 'android')
      return <Modal useNativeDriver {...this.props}>{this.props.children}</Modal>;
    return (
      <Modal
        useNativeDriver
        {...this.props}>
        <TouchableWithoutFeedback
          style={StyleSheet.absoluteFillObject}
          onPress={() => {
            this.props.onBackdropPress();
          }}>
          <View />
        </TouchableWithoutFeedback>
        {this.props.children}
      </Modal>
    );
  }
}
export default ModalComponent;
