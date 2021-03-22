import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import {
  SafeAreaView,
  View,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Keyboard,
  Animated,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { injectIntl, intlShape } from 'react-intl';

import Header from '../../../base/components/Header';
import ButtonIconText from '../../../base/components/ButtonIconText';
import ModalBase from '../../../base/components/ModalBase';

import { blue_bluezone, red_bluezone } from '../../../core/color';
import message from '../../../core/msg/bmi';

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
import ResultBmiProgress from './components/ResultBmiProgress';
const visibleModal = {
  isProcessing: false,
  isVisibleVerifySuccess: false,
  isVisibleVerifyOTPExpired: false,
  isVisibleVerifyOTPInvalid: false,
  isVisibleVerifyError: false,
};

const ResultBmiScreen = ({ route, intl, navigation }) => {
  const { formatMessage } = intl;
  const [gender, setGender] = useState(1);
  const [listProfile, setListProfile] = useState([]);
  const [listTime, setListTime] = useState([]);
  const [bmi, setBmi] = useState(0);

  const [heightError, setHeightError] = useState(null);
  const [weightError, setWeightError] = useState(null);
  const [isVisibleVerifyError, setisVisibleVerifyError] = useState(false);
  const [height, setHeight] = useState(() => route?.params.height);
  const [weight, setWeight] = useState(() => route?.params.weight);
  const onGoBack = () => navigation.goBack();
  const onCloseModalProfile = () => setisVisibleVerifyError(false);
  useEffect(() => {
    if (height && weight) {
      let h = Number(height?.replace('cm', '')?.trim() || 0) / 100;
      let w = Number(weight?.replace('kg', '')?.replace(',', '.')?.replace(' ', '') || 0);
      let totalBmi = parseFloat(w / (h * h)).toFixed(1);
      setBmi(totalBmi);
    }
  }, [height, weight]);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        // onBack={onGoBack}
        title={formatMessage(message.title)}
        styleHeader={styles.header}
        colorIcon={'#FE4358'}
        styleTitle={{
          color: '#000',
          fontSize: fontSize.fontSize20,
        }}
      />
      <ScrollView>
        <View style={styles.group}>
          <View>
            <ResultBmiProgress bmi={bmi} />
            <View>
              <SelectHeightOrWeight
                label={formatMessage(message.height)}
                value={height ? height : 'cm'}
                gender={gender}
                currentHeight={height}
                type="height"
                error={heightError ? formatMessage(message.heightError2) : null}
                onSelected={height => {
                  setHeightError(false);
                  setHeight(height);
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  route?.params?.backAndOpenModal(1)
                  navigation.goBack()
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent',
                  position: 'absolute',
                  zIndex: 999
                }} />
            </View>
            <View>
              <SelectHeightOrWeight
                label={formatMessage(message.weight)}
                value={weight ? weight : 'kg'}
                error={weightError ? formatMessage(message.weightError2) : null}
                currentWeight={weight}
                type="weight"
                gender={gender}
                listProfile={listProfile}
                time={listTime}
                onSelected={weight => {
                  setWeightError(false);
                  setWeight(weight);
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  route?.params?.backAndOpenModal(0)
                  navigation.goBack()
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent',
                  position: 'absolute',
                  zIndex: 999
                }} />
            </View>
            <ResultBMI height={height} weight={weight} resultScreen={true} />
          </View>
        </View>
      </ScrollView>
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

ResultBmiScreen.propTypes = {
  intl: intlShape.isRequired,
  onFinished: PropTypes.func,
};

ResultBmiScreen.defaultProps = {
  disabled: true,
};

export default injectIntl(ResultBmiScreen);
