import * as cv from 'opencv4nodejs'
import path from 'path'

const classifier = new cv.CascadeClassifier(path.resolve(__dirname, './lbpcascade_animeface.xml'));

const FILE_PATH = path.resolve(__dirname, '../../statics/icons/ESClient_demo_image.jpg')

export const check = async () => {
  try {
    const img = await cv.imreadAsync(FILE_PATH);
    const { objects, numDetections } = await classifier.detectMultiScaleAsync(img);
    console.log(objects, numDetections)
  } catch (err) {
    console.error(err);
  }
}
