## AWS CI/CD simple Node.js app

The purpose of this demo is show how to use some AWS services for CI/CD. We have a Node.js application utilizing Amazon Rekognition API to identify celebrities and we are going to automatize the source, build and deploy process.

![demo](./deploy/images/cicd.jpg)

To get started you will need:

- IAM user with the following access:
- CloudFormation
- Cloud9
- CodeCommit
- CodePipeline
- CodeBuild
- CodeDeploy
- EC2  

- Tested in the N. Virginia region (us-east-1).

## Key Pairs

1. Open the EC2 console at https://console.aws.amazon.com/ec2
2. In the navigation pane choose KeyPair, and create or import a Key Pair named 'cicd-keypair'
 

## CloudFormation

1. Open the CloudFormation console at https://console.aws.amazon.com/cloudformation
2. On the Welcome page, choose Create stack
3. On the Step 1 - Specify template: Choose Upload a template file, click on **Choose file** button and select the **template.yaml** located inside deploy directory
4. On the Step 2 - Specify stack details: Enter the Stack name as **'cicd-techtalk'**
5. On the Step 3 - Configure stack options: Just click on **Next** button
6. On the Step 4 - Review: Just check the resources being created, and then click on **Create Stack** button
7. Wait for stack get into status **'CREATE_COMPLETE'**
8. Under the Outputs tab, take a note of ELB DN
  

## CodeCommit
1. Open the CodeCommit console at https://console.aws.amazon.com/codecommit
2. Click on **Create repository** button, enter the Repostiory name as 'cicd-techtalk' and then click on **Create** button
3. Create a new IAM user with CodeCommit permissions and generate HTTPS Git credentials


## CodeBuild
1. Open the CodeBuild console at https://console.aws.amazon.com/codebuild
2. Choose Create build project
3. Enter the Project name as 'cicd-techtalk';
4. On Source define **AWS CodeCommit** as the source provider and select **'cicd-techtalk'** for repository
5. On Environment choose **Ubuntu** for Operational System, **Standard** for Runtime and **aws/codebuild/standard:2.0** as the Image version
6. Click on **Create build** project


## CodeDeploy
1. Open the CodeDeploy console at https://console.aws.amazon.com/codedeploy
2. Click on **Create application** button
3. Enter the Application name as **'cicd-techtalk'**, select **'EC2/On-premises'** for Compute platform and then click on **'Create'** button
4. Once your application is created, under Deployment groups tab click on **'Create deployment group'** button
5. Enter the deployment group name as **'cicd-techtalk'**
6. Select the Service Role as **'CodeDeploy-cicd-techtalk'**
7. On Environment configuration select **'Amazon EC2 instances'**, enter for Key **'Name'** and for Value **'cicd-techtalk'**
8. On Load Balancer configuration select **'cicd-techtalk-tg'**
9. Click on **'Create deployment group'** button
   

## CodePipeline
1. Open the CodePipeline console at https://console.aws.amazon.com/codepipeline
2. Choose Create pipeline
3. On the Step 1 - Choose pipeline setting: Enter the Pipeline name as **'cicd-techtalk'**
3. On the Step 2 - Add source stage:
- Select **'AWS CodeCommit'** for Source provider
- Select **'cicd-techtalk'** for Repository name
- Select **'master'** for Branch name
4. On the Step 3 - Add build stage: Select **'AWS Codebuild'** for Build provider, and **'cicd-techtalk'** for Project name
5. On the Step 4 - Add deploy stage: Select **'AWS CodeDeploy'** for Deploy provider, **'cicd-techtalk'** for Application and Deployment group
6. On the Step 5 - Review: Choose Create pipeline


## Grant access to CodeCommit on IAM
1. Open the IAM console at https://console.aws.amazon.com/iam;
2. In the navigation pane select **Users**, and then click on **'awsstudent'** username
3. Under Security Credentials tab, click on **'Generate'** button of section HTTPS Git credentials for AWS CodeCommit
4. Click on **Download credentials** button and save the generated csv file
  

## Cloud9
1. Open the Cloud9 console at https://console.aws.amazon.com/cloud9
2. On the Step 1 - Name environment: Enter the Environment name as **'cicdtech-talk'**
3. On the Step 2 - Configure settings: Just click on **Next** button
4. On the Step 3 - Review: Check the resources being created, and click on **Create Environment** button 


## Clean up
 

## Reference links
https://docs.aws.amazon.com/codebuild/latest/userguide/sample-codedeploy.html


## License summary
This sample code is made available under the MIT-0 license. See the LICENSE file.