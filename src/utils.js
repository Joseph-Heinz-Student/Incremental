const clamp = (value, min, max) => {
    if (value < min) {
        return min;
    }else if (value > max) {
        return max;
    }
    return value;
};

const abs = (value) => {
    if (value < 0) {
        return value * -1;
    }
    return value;
};