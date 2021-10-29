import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, Vibration, Dimensions, Animated, useCallback, sequence, TouchableOpacity } from 'react-native';

const {width, height} = Dimensions.get('window')

const timers = [...Array(30).keys()].map((i) => (i === 0 ? 1 : i * 3))
console.log(timers)
const ITEM_SIZE = width * 0.38
const ITEM_SPACING = (width - ITEM_SIZE) / 2

export default function App() {


  const scrollX = React.useRef(new Animated.Value(0)).current
  const [duration, setDuration] = useState(timers[0])
  const timerAnimation = React.useRef(new Animated.Value(height)).current
  const buttonAnimation = React.useRef(new Animated.Value(0)).current
  const stayFocusTextAnimation = React.useRef(new Animated.Value(0)).current
  const animation = React.useCallback(() => {
    Vibration.vibrate(100)
    Animated.sequence([ 
      
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      }),

      Animated.timing(stayFocusTextAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      }),

      Animated.timing(timerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),

      Animated.timing(timerAnimation, {
        toValue: height,
        duration: duration * 1000,
        useNativeDriver: true,

      }),

    ]).start(() => {
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(),
      Animated.timing(stayFocusTextAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true
      })
      .start(() => {

      })
    })
  }, [duration])

  const opacity = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  })

  const translateY = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400]
  })

  const translateYtext = stayFocusTextAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200]
  })
  
  const scaleText = stayFocusTextAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3]
  })


  return (
    <View style={styles.container}>
      <StatusBar
        hidden
      />
      <Animated.View 
        style={[StyleSheet.absoluteFillObject, {
          height,
          width,
          backgroundColor: 'rgba(80, 200, 140, 1)',
          transform: [{
            translateY: timerAnimation
          }]
        }]}
      />
      <Animated.View style={{
        transform: [{translateY: translateYtext}],
        transform: [{scale: scaleText}]
      }}>
        <Text style={styles.majorText}>Stay Focus</Text>
      </Animated.View>
      <View style={styles.timer}>
        <Animated.FlatList
          data={timers}
          keyExtractractor={item => item.toString()}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          snapToInterval={ITEM_SIZE}
          style={styles.flatlist}
          decelerationRate="fast"
          onMomentumScrollEnd={ev => {
            const index = Math.round(ev.nativeEvent.contentOffset.x / ITEM_SIZE)
            setDuration(timers[index])
          }}
          onScroll={
            Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true}
          )
        }
          contentContainerStyle={
            { paddingHorizontal: ITEM_SPACING }
          }
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
              (index + 1) * ITEM_SIZE,
            ]

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4]
            })

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.6, 1, 0.6]
            })
            

            return (
              <View style={{width: ITEM_SIZE, alignItems: 'center', justifyContent: 'center'}}> 
                <Animated.Text style={[styles.timerTime, {
                 opacity,
                  transform: [{
                    scale
                  }]
                }]}>
                  {item}
                </Animated.Text>
              </View>
            )
          }}
        />

        <Animated.View 
          style={[styles.buttons, {
            transform: [{translateY}]
          }]}
        >
          <TouchableOpacity onPress={animation} style={styles.startButton}></TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    alignItems: 'center',
    flex: 1,
  },
  majorText: {
    fontSize: 24,
    color: '#fff',
    marginTop: 20,
  },
  minorText: {
    color: '#bbb'
  },
  timer: {
    marginTop: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flatlist: {
    flexGrow: 0,
  },
  timerTime: {
    color: '#fff',
    borderRadius: 40,
    fontSize: 70,
    padding: 0
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100
  },
  startButton: {
    fontSize: 40,
    backgroundColor: 'rgba(250, 140, 90, 1)',
    borderRadius: 50,
    textAlign: 'center',
    padding: 40,
  }
});
