import { StyleSheet } from 'react-native';

const getStyles = (userType) => {
  let primaryColor;

  if (userType === 'kid') {
    primaryColor = '#7f32a8'; // or any other color you desire for kids
  } else if (userType === 'parent') {
    primaryColor = '#1960bd'; // or any other color you desire for parents
  } else {
    primaryColor = '#1960bd'; // default color
  }

  const colors = {
    white: 'white',
    primary: primaryColor,
    black: 'black',
    borderGrey: '#ccc',
    textGrey: '#555',
    strikeGrey: '#ddd',
    strikeActive: '#d43a2f',
    keptGreen: '#39db39',
  };

  const styles = StyleSheet.create({
    text: {
      fontFamily: 'Inter_400Regular',
      color: colors.white,
      fontWeight: 16,
    },
    labelTitle: {
      fontFamily: 'Inter_400Regular',
      fontSize: 18,
      color: 'black',
      textAlign: 'center',
      padding: 5,
    },
    buttonLabelStyle: {
      color: 'white',
    },
    flexBtns: {
      flexDirection: 'column',
      rowGap: 10,
    },
    scrollView: {
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    dashboardTitle: {
      fontSize: 24,
      paddingBottom: 10,
      alignSelf: 'center',
      color: colors.black,
      fontFamily: 'Inter_700Bold',
    },
    rewardButton: {
      backgroundColor: colors.primary,
      borderRadius: 25,
      fontFamily: 'Inter_700Bold',
    },
    cardContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 20,
    },

    card: {
      borderRadius: 15,
      elevation: 3,
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.white,
      marginBottom: 20,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: 'none',
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    statCard: {
      padding: 20,
      borderRadius: 15,
      elevation: 3,
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.white,
      marginBottom: 20,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: 'none',
      shadowOpacity: 0,
      shadowRadius: 0,
    },

    rewardContent: {
      flex: 1,
      alignItems: 'center', // Horizontally center content
      padding: 40,
    },
    lineAndNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,
    },
    childName: {
      
      fontSize: 20,
      color: colors.black,
      flex: 1,
      fontFamily: 'Inter_700Bold',
    },
    promiseScore: {
      fontSize: 16,
      color: 'black',
      marginBottom: 5,
      fontFamily: 'Inter_400Regular',
    },
    reward: {
      fontSize: 48,
      fontWeight: 800,
      justifyContent: 'center',
      alignSelf: 'center',
      color: 'black',
      marginBottom: 5,
      fontFamily: 'Inter_400Regular',
      padding: 50,
    },
    promiseScoreLine: {
      height: 18,
      backgroundColor: colors.primary,

    },
    barContainer: {
      alignSelf: 'center',
      flexDirection: 'row',
      width: '80%',
      borderColor: colors.borderGrey,
      borderWidth: 1,
      height: 20,
      marginBottom: 20,
    },
    scoreValue: {
      marginLeft: 10,
      fontFamily: 'Inter_400Regular',
    },


  promiseText: {
      colors: colors.primary
  },
  
  promiseName: {
      fontSize: 16,
      color: colors.black,
      fontFamily: 'Inter_700Bold',
  },
  
  promiseDueDate: {
      fontSize: 14,
      color: colors.primary,
      fontFamily: 'Inter_400Regular',
  },
  
  promiseAction: {
      fontSize: 14,
      color: colors.black,
      fontFamily: 'Inter_400Regular',
      textAlign: 'center',
      padding: 10,
  },
  

  strikeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'white',
    borderColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 0,
    borderBottomLeftRadius: 10,
},
strikeContainer: {
  flexDirection: 'row', // This makes sure the strikes are side by side
  justifyContent: 'center',
  display: 'flex',
},  
  keptButton: {
      flex: 1,
      alignItems: 'center',
      padding: 5,
      backgroundColor: colors.primary,
      borderRadius: 0,
      borderBottomRightRadius: 10,

  },
  

  
  activeStrike: {
      color: '#b01a1a',
  },
  
    
    buttonWrapper: {
      flex: 1,
      flexDirection: 'row',
    },
    
    button: {
      flex: 1,
      alignItems: 'center',
      padding: 15,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      borderRightWidth: 0.5, // Adds border in the middle to separate the two buttons
      borderColor: 'white', // Border color
    },
    
    button1: {
      flex: 1,
      alignItems: 'center',
      padding: 15,
      backgroundColor: colors.primary, // This will ensure both buttons have the same background color
      justifyContent: 'center',
    },
    squareButton: {
      flex: 1, // this ensures each button takes up half the space
      alignItems: 'center', // To center the button text
      borderRightWidth: 1,
      borderRightColor: colors.primary,

    },  
    checkpointReward: {
      fontSize: 12,
      alignSelf: 'center',
      color: colors.textGrey,
      fontFamily: 'Inter_400Regular',
      marginBottom: 5,
    },

//-----Promise Cards-------

smallCard: {
  width: '100%', // Reduced to 80% of parent width
  borderRadius: 10,
  padding: 5, // Reduced padding
  borderWidth: 3,
  borderColor: colors.primary,
  backgroundColor: colors.white,
  marginBottom: 15,
  alignSelf: 'center', // Center the card if its parent is flex
  shadowOffset: { width: 1, height: 1 },
  shadowColor: 'none',
  shadowOpacity: 0,
  shadowRadius: 0,
},
promiseCardContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // Spread children across the card width
},
title: {
  fontFamily: 'Inter_400Regular',
  fontSize: 18,
  color: 'black',
  flex: 1, // Allow text to take as much space as it needs
},
strikesContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
strike: {
  fontSize: 20,
  color: colors.strikeGrey,
  fontWeight: 700,
  marginLeft: 5, // Space out the X's a bit
},
redStrike: {
  color: '#b01a1a',
},

//---------End of Promise Card-------
purpleText: {
  color: '#7f32a8',
  fontWeight: 1000,
},

setRewardsButton: {
  width: 150,
  height: 40,
  backgroundColor: colors.primary,
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  borderRadius: 10,
  marginBottom: 10,
  fontFamily: 'Inter_400Regular'
},

    kidsDashboardButton: {
      width: 150,
      height: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    buttonContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonStyle: {
      borderWidth: 1,
      borderColor: colors.black,
      borderRadius: 5,
      backgroundColor: colors.primary,
      color: colors.white,
      width: 45,
      height: 25,
      justifyContent: 'center',
      padding: 0,
      margin: 0,
    },
    promiseSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      color: colors.primary,
    },
    activeSection: {
      color: colors.primary,
      
      fontFamily: 'Inter_400Regular',
      fontSize: 18,
    },
    boldText: {
      fontWeight: '800',
      fontFamily: 'Inter_400Regular',
      color: 'black'

    },    
    inactiveSection: {
      color: colors.borderGrey,
      
      fontFamily: 'Inter_400Regular',
      fontSize: 18,
    },

    container: {
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 15,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: 'none',
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 3,
      marginBottom: 20,
      backgroundColor: 'none',
    },

    input: {
      elevation: 3,
      borderWidth: 2,
      borderColor: colors.primary,
      backgroundColor: colors.white,
      marginBottom: 20,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: 'none',
      shadowOpacity: 0,
      shadowRadius: 0,
      borderRadius: 15,
      width: 300,
      height: 100,
      textAlignVertical: 'top',
    },
    scoreText: {
      fontSize: 24,
      color: colors.primary,
      marginTop: 10,
    },
    rewardText: {
      fontSize: 16,
      color: colors.primary,
      marginTop: 10,
    },
    promiseSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      color: colors.primary,
    },
    activeSection: {
      color: colors.primary,
      
      fontFamily: 'Inter_400Regular',
      fontSize: 18,
    },
    inactiveSection: {
      color: colors.borderGrey,
      
      fontFamily: 'Inter_400Regular',
      fontSize: 18,
    },
    mainContainer: {
      padding: 10,
    },

    buttonText: {
      color: colors.white,
      textAlign: 'center',      
    },
    inviteSection: {
      marginTop: 20,
      padding: 15,  
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 15,
      backgroundColor: colors.white,
    },
    inviteTitle: {
      fontSize: 18,
      color: colors.primary,
      marginBottom: 10,
      textAlign: 'center',
      fontFamily: 'Inter_700Bold',
    },
    inviteCode: {
      fontSize: 32,
      color: colors.black,
      padding: 10,
      textAlign: 'center',
      fontFamily: 'Inter_400Regular',
    },
    requestContainer: {
      marginTop: 10,
    },
    requestItem: {
      fontSize: 14,
      color: colors.textGrey,
      marginBottom: 5,
      fontFamily: 'Inter_400Regular',
    },
    memberCard: {
      width: '48%', // Adjust the width based on your desired layout
      minHeight: 150,
      minWidth: 150,
      aspectRatio: 1, // To make it a square
      backgroundColor: '#ffffff', // Adjust the background color as needed
      borderRadius: 15,
      elevation: 3,
      borderWidth: 2,
      borderColor: colors.primary,
      marginBottom: 20,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: 'none',
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    averageScore: {
      alignSelf: 'center',
      fontSize: 16,
    },
    requestCard: {
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: 15,
      backgroundColor: colors.white,
      marginBottom: 10,
      elevation: 3,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: 'none',
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    requestText: {
      fontSize: 12,
      color: colors.textGrey,
      fontFamily: 'Inter_400Regular',
      padding: 10,
      textAlign: 'center'
    },
    requestButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    acceptButton: {
      backgroundColor: colors.primary,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    denyButton: {
      backgroundColor: colors.black,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },

    requestHistoryItem: {
      alignSelf: 'center',
      color: colors.textGrey,
      fontStyle: 'italic',
      padding: 5,
      
    },
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center', // Center content horizontally
    },

    cardTitle: {
      fontSize: 24,
      
      marginBottom: 20,
      color: colors.black,
      alignSelf: 'center', // Center the title horizontally
    },
    profileTitle: {
      fontSize: 24,
      
      marginBottom: 20,
      color: colors.black,
      alignSelf: 'center', // Center the title horizontally
    },
    userInfo: {
      marginBottom: 20,
    },
    infoLabel: {
      alignSelf: 'center',
      fontSize: 32,
      color: colors.primary,
      fontWeight: 600,
    },
    infoText: {
      alignSelf: 'center',
      fontSize: 32,
      color: colors.black,
    },
    promiseSection: {
      marginTop: 20,
      width: '100%', // Set width to ensure centered alignment
      alignItems: 'center', // Center content horizontally
    },
    promiseTitle: {
      fontSize: 20,
      marginBottom: 10,
      color: colors.primary,
      alignSelf: 'center', // Center the title horizontally
    },
    promiseCard: {
      backgroundColor: colors.white,
      borderRadius: 10,
      elevation: 3,
      marginBottom: 15,
      borderColor: colors.primary,
      borderWidth: 2,
      width: '100%', // Expand the card's width
    },
    promiseRewardCard: {
      backgroundColor: colors.white,
      borderRadius: 10,
      elevation: 3,
      marginBottom: 15,
      padding: 15,
      borderColor: colors.primary,
      borderWidth: 2,
      width: '100%', // Expand the card's width
    },

    promiseRewardValue: {
      fontSize: 14,
      color: colors.textGrey,
      fontFamily: 'Inter_400Regular',
    },
    profileImage: {
      width: 150, // Adjust the width as needed
      height: 150, // Adjust the height as needed
      resizeMode: 'contain', // or 'cover' depending on your image aspect ratio
      marginBottom: 10,
      alignSelf: 'center', // Center the image horizontally
    },
    profileIcon: {
      width: 50, // Adjust the width as needed
      height: 50, // Adjust the height as needed
      resizeMode: 'contain', // or 'cover' depending on your image aspect ratio
      marginBottom: 10,
      alignSelf: 'center', // Center the image horizontally
    },

    indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 10,
      padding: 25,
    },
    indicator: {
      width: 40,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      backgroundColor: colors.borderGrey, // Inactive color
    },
    indicatorActive: {
      backgroundColor: colors.primary, // Active color
    },
    setRewardsContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.white,
      alignItems: 'center', // Center content horizontally
    },
    setRewardsTitle: {
      fontSize: 24,
      
      marginBottom: 20,
      color: colors.black,
      alignSelf: 'center', // Center the title horizontally
    },
    rewardInput: {
      width: '100%',
      height: 40,
      borderColor: colors.borderGrey,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
      fontFamily: 'Inter_400Regular',
      backgroundColor: colors.white,
    },
    rewardInput1: {
      width: '100%',
      height: 100,
      borderColor: colors.borderGrey,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
      fontFamily: 'Inter_400Regular',
      backgroundColor: colors.white,
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignSelf: 'center',
    },
    addButtonText: {
      color: colors.white,
      
    },
    rewardsList: {
      width: '100%',
    },
    rewardItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      borderColor: colors.borderGrey,
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 10,
      backgroundColor: colors.white,
    },
    rewardText: {
      flex: 1,
      marginLeft: 10,
      color: colors.black,
      fontFamily: 'Inter_400Regular',
    },
    deleteButton: {
      backgroundColor: colors.strikeActive,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    deleteButtonText: {
      color: colors.white,
    },
    rewardCard: {
      backgroundColor: colors.white,
      borderRadius: 15,
      elevation: 3,
      borderWidth: 2,
      borderColor: colors.primary,
      marginVertical: 10, // Adds a margin to the top and bottom of each reward card
      shadowOffset: { width: 1, height: 1 },
      shadowColor: 'none',
      shadowOpacity: 0,
      shadowRadius: 0,
      padding: 10, // Adds padding inside the card
    },
    
    rewardText: {
      fontSize: 16,
      color: colors.black,
      fontFamily: 'Inter_400Regular',
    },
    chartContainer: {
      height: 200,
      padding: 16,
      marginTop: 16,
      marginBottom: 16,
      backgroundColor: 'white',
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
  },
  statusContainer: {
   display: 'flex',
   flexDirection: 'row' 
  },
  statusIndicator: {
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
  },
  statusSection:{
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  statusText: {
    color: colors.white,
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  subRow: {
    flex: 1,
    justifyContent: 'center'
  },
  resetSection: {
    alignItems: 'center',
  },
  resetSelector: {
    flexDirection: 'row',
    padding: 20,
    alignContent: 'center',
    alignSelf: 'center',

  },
  resetBtn: {
    fontFamily: 'Inter_700Bold',
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 10,
    width: 100,
    padding: 10,
    marginRight: 10,
    alignItems: 'center'
  },
  resetBtnInactive: {
    fontFamily: 'Inter_700Bold',
    backgroundColor: colors.strikeGrey,
    color: colors.black,
    borderRadius: 10,
    width: 100,
    padding: 10,
    marginRight: 10,
    alignItems: 'center'
  },
  cardContent: {
    padding: 20,
  },
  cardContent1: {
    padding: 20,
    flexDirection: 'row', // set children to display in a row
    alignItems: 'center',  // vertically center align the children
  },
  
  textContainer: {
    flex: 1,              // make text container take up most of the width
  },
  
  promiseRewardName: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.black,
    fontFamily: 'Inter_700Bold',
  },
  
  deleteBtn: {
    backgroundColor: '#b50d0d',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },


//------ newParent.js STYLES ------//
container1: {
  flex: 1,
  padding: 20,
  backgroundColor: '#F5F5F5',
},
title1: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  fontFamily: 'Inter_700Bold',
},
  sectionTitle1: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Inter_400Regular',
    marginTop: 20,
  },
  input1: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'Inter_400Regular',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: 'white'
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button1: {
    backgroundColor: '#DDD',
    padding: 10,
    borderRadius: 8,
    width: '48%',
  },
  buttonActive1: {
    backgroundColor: '#1960bd',
    padding: 10,
    borderRadius: 8,
    width: '48%',
  },
  buttonText1: {
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    color: 'white',
  },
  inviteText1: {
    fontSize: 18,
    marginTop: 20,
    alignSelf: 'center',
    fontFamily: 'Inter_400Regular',
    color: '#1960bd',
  },
  submitButton1: {
    backgroundColor: '#1960bd',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText1: {
    color: 'white',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  
//---- END of newParent.js ----//

  suggestionsContainer: {
    backgroundColor: 'none',
    margin: 10,
    alignContent: 'center'
  },
  suggestionItem: {
    textAlign: 'center',
    padding: 20,
    borderColor: '#1960bd',
    backgroundColor: '#1960bd',
    borderRadius: 5,
    borderWidth: 2,
    margin: 5,
  },

  positionLeft: {
    alignContent: 'flex-start'
  },
  positionRight: {
    alignContent: 'flex-end'
  },
  positionCont: {
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  promisesTitle: {
    textAlign: 'center',
    padding: 20,
  },
  tickBox: {
    borderRadius: 0,
    backgroundColor: 'none',
    width: '100%', 
    justifyContent: 'center',
    flex: 1,
  },
  xBox: {
    backgroundColor: 'none',
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  actionButtonContainer: {
    alignSelf: 'stretch', 
    display: 'flex',
    flexDirection: 'row',

  },
  buttonRow: {
    flexDirection: 'row', 
    width: '100%', 
  },
  buttonContainer1: {
    flex: 1, // This ensures each child (i.e., the buttons) will take up 50% of the width
    alignItems: 'stretch', // This stretches each button to take up the entire width of its container (i.e., 50% of the Card width)
  },
  });

  return styles;
};

export default getStyles;
