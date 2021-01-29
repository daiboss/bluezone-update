import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Keyboard,
  Animated,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { injectIntl, intlShape } from 'react-intl';

import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';
import ModalBase from '../../../base/components/ModalBase';

import { blue_bluezone, red_bluezone } from '../../../core/color';
import message from '../../../core/msg/bmi';
import FastImage from 'react-native-fast-image';
// Styles
import styles from './styles/index.css';
import * as fontSize from '../../../core/fontSize';
import SelectGender from './components/SelectGender';
import SelectHeightOrWeight from './components/SelectHeightOrWeight';
import { getProfile, setProfile } from '../../../core/storage';
const TIMEOUT_LOADING = 800;
import moment from 'moment';
import { ButtonClose } from '../../../base/components/ButtonText/ButtonModal';
import ResultBMI from './components/ResultBMI';
import Modal from 'react-native-modal'
import { DATA_LEFT } from '../../../base/components/ModalPickerWeight/data';

const visibleModal = {
  isProcessing: false,
  isVisibleVerifySuccess: false,
  isVisibleVerifyOTPExpired: false,
  isVisibleVerifyOTPInvalid: false,
  isVisibleVerifyError: false,
};

const BmiScreen = ({ route, intl, navigation }) => {
  const { formatMessage } = intl;
  const [heightError, setHeightError] = useState(null);
  const [weightError, setWeightError] = useState(null);
  const [isVisibleVerifyError, setisVisibleVerifyError] = useState(false);
  const [height, setHeight] = useState(undefined);
  const [weight, setWeight] = useState(undefined);
  const [autoOpen, setAutoOpen] = useState(-1)

  const onGoBack = () => navigation.goBack();
  const onConfirm = async () => {
    try {
      if (!height) {
        setHeightError(true);
      }
      if (!weight) {
        setWeightError(true);
      }
      if (!height || !weight) return;
      setAutoOpen(-1)
      navigation.navigate('resultBmi', {
        height,
        weight,
        backAndOpenModal: backAndOpenModal
      });
    } catch (error) {
      setisVisibleVerifyError(true);
    }
  };
  const validateProfile = () => { };
  const onCloseModalProfile = () => setisVisibleVerifyError(false);

  const backAndOpenModal = (type) => {
    setAutoOpen(type)
  }

  const selectedHeight = (h) => {
    setHeightError(false);
    setHeight(h);
  }

  const selectedWeight = (w) => {
    setWeightError(false);
    setWeight(w);
  }

  const onSelectedValue = (v) => {
    if (v?.includes('kg')) {
      selectedWeight(v)
    } else {
      selectedHeight(v)
    }
  }

  const [isShow, setIsShow] = useState(false)
  const openM = () => setIsShow(true)
  const closeM = () => setIsShow(false)

  return (
    <SafeAreaView style={styles.container}>
      <Header
        // onBack={onGoBack}
        colorIcon={'#FE4358'}
        title={formatMessage(message.title)}
        styleHeader={styles.header}
        styleTitle={{
          color: '#000',
          fontSize: fontSize.bigger,
        }}
      />
      <View style={styles.group}>
        <View>
          <View style={[styles.container2]}>
            <View style={[styles.container3]}>
              <FastImage
                source={require('./styles/images/ic_info.png')}
                style={[styles.iconInfo]}
              />
              <Text style={styles.textLabel}>
                {formatMessage(message.content)}
              </Text>
            </View>
          </View>

          <SelectHeightOrWeight
            visiHeight={autoOpen == 1}
            label={formatMessage(message.height)}
            value={height ? height : 'cm'}
            type="height"
            currentHeight={height}
            error={heightError ? formatMessage(message.heightError2) : null}
            onSelected={onSelectedValue}
          />

          <SelectHeightOrWeight
            visiWeight={autoOpen == 0}
            label={formatMessage(message.weight)}
            value={weight ? weight : 'kg'}
            error={weightError ? formatMessage(message.weightError2) : null}
            type="weight"
            currentWeight={weight}
            onSelected={onSelectedValue}
          />
          {/* <TouchableOpacity onPress={openM}>
            <Text>MOMOMO</Text>
          </TouchableOpacity> */}
          <Modal style={{

          }}
            useNativeDriver
            isVisible={isShow}
            onBackdropPress={closeM}
          >
            <View style={{
              width: '100%',
              paddingVertical: 70,
              backgroundColor: '#fff'
            }}>
              <FlatList
                data={DATA_LEFT}
                keyExtractor={(item) => item}
                renderItem={({ item, index }) => (
                  <View>
                    <Text>{item}</Text>
                  </View>
                )}
              />

              {/* {
                DATA_LEFT.map(item => (
                  <View key={item}>
                    <Text>{item}</Text>
                  </View>
                ))
              } */}
              <Text>dsjhak</Text>
            </View>
          </Modal>
        </View>
        <View style={styles.buttonConfirm}>
          <ButtonIconText
            onPress={onConfirm}
            text={formatMessage(message.finish)}
            styleBtn={[styles.colorButtonConfirm]}
            styleText={{ fontSize: fontSize.normal, fontWeight: 'bold' }}
          />
        </View>
      </View>
      <ModalBase
        isVisibleModal={isVisibleVerifyError}
        title={formatMessage(message.titleSendError)}
        description={formatMessage(message.sendError)}>
        <View style={styles.modalFooter}>
          <ButtonClose
            text={formatMessage(message.close)}
            onPress={onCloseModalProfile}
          />
        </View>
      </ModalBase>
    </SafeAreaView>
  );
};

BmiScreen.propTypes = {
  intl: intlShape.isRequired,
  onFinished: PropTypes.func,
};

BmiScreen.defaultProps = {
  disabled: true,
};

export default injectIntl(BmiScreen);
