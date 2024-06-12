import { KubectlV29Layer } from "@aws-cdk/lambda-layer-kubectl-v29";
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as eks from 'aws-cdk-lib/aws-eks'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TestK8SClusterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Create a new VPC for our cluster
    const vpc = new ec2.Vpc(this, "EKSVpc");

    // Create Cluster with no default capacity (node group will be added later)
    const eksCluster = new eks.Cluster(this, "cdkCluster", {
      clusterName: "cdkCluster",
      vpc: vpc,
      defaultCapacity: 0,
      version: eks.KubernetesVersion.V1_29,
      kubectlLayer: new KubectlV29Layer(this, "kubectl"),
      ipFamily: eks.IpFamily.IP_V4,
      clusterLogging: [
        // eks.ClusterLoggingTypes.API,
        // eks.ClusterLoggingTypes.AUTHENTICATOR,
        // eks.ClusterLoggingTypes.SCHEDULER,
        eks.ClusterLoggingTypes.AUDIT,
        // eks.ClusterLoggingTypes.CONTROLLER_MANAGER,
      ],
      outputClusterName: true,
      outputConfigCommand: true,
    });

    const nodeGroup = eksCluster.addNodegroupCapacity("custom-node-group", {
      amiType: eks.NodegroupAmiType.AL2_X86_64,
      instanceTypes: [new ec2.InstanceType("m5.large")],
      desiredSize: 2,
      diskSize: 20,
      nodeRole: new iam.Role(this, "eksClusterNodeGroupRole", {
        roleName: "eksClusterNodeGroupRole",
        assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSWorkerNodePolicy"),
          iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2ContainerRegistryReadOnly"),
          iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKS_CNI_Policy"),
        ],
      }),
    });

    const awsAuth = new eks.AwsAuth(this, "aws-auth", {
      cluster: eksCluster
    });

    const adminRole = iam.Role.fromRoleArn(this, "adminRole", "arn:aws:iam::891377227670:role/manualAdmin");
    // const adminRole = iam.Role.fromRoleArn(this, "adminRole", "arn:aws:iam::891377227670:root");

    awsAuth.addMastersRole(adminRole);
    awsAuth.addRoleMapping(nodeGroup.role, {
      username: "system:node:{{EC2PrivateDNSName}}",
      groups: ["system:bootstrappers", "system:nodes", "system:masters"]
    });
  }
}
