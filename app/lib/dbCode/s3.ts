import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "",
        secretAccessKey: "",
    }
});

export async function UploadS3(mainImg: any) {
    try {
        if (mainImg) {
            const name = `Image:Upload-${new Date().valueOf()}.JPG`
            const command = new PutObjectCommand({
                Bucket: "",
                Key: name,
                Body: await mainImg.arrayBuffer(),
            });
            try {
                await client.send(command);
                // revalidatePath('/dashboard/images')
                // redirect('/dashboard/images')
            } catch (err) {
                console.log(err)
                return
            }
        }
    } catch (error) {
        return mainImg
    }
}

export async function DeleteS3(key: string) {
    const command = new DeleteObjectCommand({
        Bucket: "",
        Key: key,
    });
    try {
        await client.send(command);
        // revalidatePath('/dashboard/images')
        // redirect('/dashboard/images')
    } catch (err) {
        console.error(err);
    }
}