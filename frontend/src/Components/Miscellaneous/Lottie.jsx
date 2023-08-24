import Lottie from "lottie-react";
import animationData from './Animations/typing.json'

const LottieComponent = () => {
    const animationStyle = {
        width: '60px',
        margin: '-15px 0px -15px 35px'
    };
    return (
        <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={animationStyle} // Apply the animationStyle
        />
    );
};

export default LottieComponent;