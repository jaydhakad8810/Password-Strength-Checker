pipeline {
agent any

```
stages {

    stage('Clone') {
        steps {
            git branch: 'feature-enhancement', url: 'https://github.com/jaydhakad8810/Password-Strength-Checker.git'
        }
    }

    stage('Check Files') {
        steps {
            bat 'dir'
        }
    }

    stage('Run Project') {
        steps {
            bat 'start index.html'
        }
    }

}
```

}
