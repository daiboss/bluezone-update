import React, { useState, useEffect, useCallback } from 'react';
import * as PropTypes from 'prop-types';
import { View, Platform, TouchableOpacity, Dimensions } from 'react-native';
// Components
import Text from '../Text';
// Styles
import styles from './styles/index.css';
import ModalComponent from '../ModalComponent';
import message from './../../../core/msg/setting'
const windowWidth = Dimensions.get('window').width;

function ModalAddShortcut({
  isVisibleModal,
  onCloseModal,
  onSelected,
  intl,
}) {
  const { formatMessage } = intl;

  const selectHeight = () => {
    onSelected && onSelected();
    onCloseModal();
  };

  return (
    <ModalComponent
      isVisible={isVisibleModal}
      onBackdropPress={onCloseModal}
      backdropOpacity={0.5}
      animationInTiming={500}
      animationOutTiming={500}
      style={styles.modal}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}>
      <View style={styles.content}>
        <View style={styles.body}>

          <Text style={styles.txRecomends}>Bạn có muốn thêm Tiện ích sức khoẻ vào Màn hình chính không?</Text>

          <TouchableOpacity
            onPress={selectHeight}
            activeOpacity={0.8}
            style={styles.btnSave}>
            <Text style={styles.txButton}>
              Đồng Ý
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onCloseModal}
            activeOpacity={0.8}
            style={[styles.btnSave, {
              backgroundColor: '#eee'
            }]}>
            <Text style={[styles.txButton, {
              color: '#222'
            }]}>
              Không
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </ModalComponent>
  );
}

ModalAddShortcut.propTypes = {
  isVisibleModal: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.any,
  onCloseModal: PropTypes.func,
  styleTitle: PropTypes.object,
  styleDescription: PropTypes.object,
};

ModalAddShortcut.defaultProps = {
  onCloseModal: () => { },
  styleTitle: {},
  styleDescription: {},
};

export default ModalAddShortcut;
