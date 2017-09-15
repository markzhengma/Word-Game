import React, { Component } from 'react';
import axios from 'axios';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            newWordData: null,
            unspelled: ['W', 'O', 'R', 'D', 'D', 'D', 'D'],
            spelled: [],
            completed: false,
            letter: 'W',
            letterList: [ 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z' ],
        }
        this.getNewWord = this.getNewWord.bind(this);
        this.saveNewWord = this.saveNewWord.bind(this);
        this.spellWord = this.spellWord.bind(this);
    };

    getNewWord = () => {
        console.log('get new word...');
        axios.get('/word/new')
        .then(res => {
            console.log(res.data);
            this.setState({
                spelled:[],
                newWordData: res.data,
                unspelled: res.data[0].spell.toUpperCase().split('')
            })
        })
        .catch(err => {
            console.log(err)
        });
    };

    saveNewWord = () =>{
        let words = this.props.userWordData.map(word => {
            return word.spell;
        });
        if (this.state.newWordData){
            if(!words.includes(this.state.newWordData[0].spell)){
                console.log('Saving this word...');
                axios.post('/usersword/new', {
                    spell: this.state.newWordData[0].spell
                })
                .then(() =>{
                    this.props.userWordData.push(this.state.newWordData[0]);
                })
                .then(() => {
                    this.setState({
                        newWordData: null,
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            }else{
                console.log('This word exists already...')
            };
        }
    };

    spellWord = (letterBox) => {
        // this.setState({
        //     letter: 'W',
        // })
        // if (this.state.letter == this.state.unspelled[0]){
        //     console.log('correct!')
        //     setTimeout(()=>{
        //         this.setState({
        //         unspelled: this.state.unspelled.shift(),
        //     })},1)
        // }
        if (letterBox === this.state.unspelled[0]){
            let shiftLetter = function(arr){
                arr.shift();
                return arr
            }
            this.setState({
                spelled: this.state.spelled.concat(this.state.unspelled[0]),
                unspelled: shiftLetter([...this.state.unspelled]),
            })
        } else {
            console.log('whoops, wrong letter')
        }
    };

    render(){
        return(
            <div className = 'game-room'>
                <div className = 'word-box'>
                    {this.state.spelled.length ? 
                        [...this.state.spelled].map(letter =>{
                            return <b>{letter}</b>
                        })
                        : ''}
                    {this.state.unspelled ? 
                        [...this.state.unspelled].map(letter => {
                            return <small>{letter}</small>
                        })
                        : ''}
                </div>
                {[...this.state.unspelled].length === 0 ? this.saveNewWord() : ''}
                <div className = 'test-btn' onClick = {this.getNewWord}>Get New Word</div>
                <div className = 'test-btn' onClick = {this.saveNewWord}>Save This Word</div>
                <hr />
                {[...this.state.letterList].map(letterBox => {
                    return <div className = 'test-btn' onClick = {() => {this.spellWord(letterBox)}}>{letterBox}</div>
                })}
                {this.state.unspelled.length ? 
                    [...this.state.unspelled].map(letterBox => {
                    return <div className = 'test-btn' onClick = {() => {this.spellWord(letterBox)}}>{letterBox}</div>
                }) : ''}
            </div>
        )
    }
}

export default Game;