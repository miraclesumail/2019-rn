const gen = Array.from({})

const getPosition = (value, height) => parseInt(value, 10) * height * -1;
const getTranslateStyle = position => ({
  transform: [
    {
      translateY: position,
    }
  ],
});

class Tick extends component {
      componentWillMount() {
          this.animation = new Animated.value(getPosition(this.props.value, this.props.height))
      }

      componentDidUptate(prevProps, prevState) {
          if(this.props.value != prevProps.value) {
               Animate.timing(this.animation, {

               }).start()
          } 
      }

      render() {

          return (
              <Animated.View style={trn}>
                      {
                          numberRange.map(() => (
                              <Text>
                          ))
                      }

              </Animated.View>
          )
      }
}