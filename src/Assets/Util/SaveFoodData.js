import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage';
import { exp } from 'react-native-reanimated';

const catagori = ["KFood","Stew","CFood","JFood","WFood","Snack","Noodle","Etc"]
const foodName = {
                0 : ["갈비","게장","곱창","김치볶음밥","껍데기","닭갈비","닭발","떡갈비","보쌈","불고기",
                      "비빔밥","삼겹살","생선구이","수제비","오징어볶음","육회","전","제육볶음","족발","죽",
                      "찜닭","조개구이"],
                1 : ["김치찌개","설렁탕","떡국","갈비찜","순두부찌개","닭도리탕","매운탕","삼계탕","감자탕","뼈해장국",
                      "육개장","국밥","추어탕","갈비탕","백숙","부대찌개","된장찌개","청국장","아귀찜",],
                2 : ["깐쇼새우","깐풍기","마라탕","마파두부","볶음밥","양꼬치","양장피","유린기","짜장면","짬뽕",
                    "탕수육","훠궈"],
                3 : ["낫토","돈까스","라멘","메밀소바","샤브샤브","연어덮밥","초밥","회"],
                4 : ["리조또","샐러드","스파게티","크림파스타","피자","함박스테이크","햄버거","치킨"],
                5 : ["김밥","닭강정","도시락","떡볶이","만두","밥버거","샌드위치","순대","쫄면","컵밥","핫도그"],
                6 : ["냉면","막국수","비빔국수","쌀국수","잔치국수","칼국수","콩국수","우동"],
                7 : ["카레","월남쌈"]
              }

let count = 0;
const saveData = async() => {
  for(let i=0;i<8;i++){
    for(let j=0;j<foodName[i].length;j++){
        try{
            await storage().ref(`${foodName[i][j]}.jpg`).getDownloadURL().then(res => {
            database().ref(`/Food/${count}`).set({
                id: count,
                name : foodName[i][j],
                url : res,
                catagori : catagori[i],
            })}
            ).then(() => console.log('Data set.'));
        }catch(e){
            console.log(foodName[i][j]);
        }
        count += 1;
    }
  }
  console.log("End...")
}

const tagCatagori = ["Emotion","Anniversary","Weather"]
const tag = [ ["기쁠때","슬플때","화날때","지루할때","놀랐을때","무서울때","짜증날때","쓸쓸할때","어색할때","답답할때","고요할때","뿌듯할때","초조할때","우울할때", "행복할때"],
  ["봄","여름","가을","겨울","크리스마스","1주년","생일","100일 기념","입학식","졸업식","퇴사","입사"],
  ["맑음","구름많음","흐림","소나기","비","천둥번개","눈"]
]

const saveTagData = () => {
  for(let i=0;i<tagCatagori.length;i++){
    for(let j=0;j<tag[i].length;j++){
      database().ref(`/Tag/${tag[i][j]}`).set({
        category: tagCatagori[i],
        like : {
          0 : 0,
        },
      }).then( ()=> console.log("Data set"));
    }
  }
  console.log("End..");
}

export default {saveData, saveTagData}