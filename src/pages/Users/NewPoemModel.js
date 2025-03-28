import { Modal, Form, Input, Select, Button, Space } from "antd"
import { categories } from "./data"

const { TextArea } = Input
const { Option } = Select

const NewPoemModal = ({ visible, onCancel, onFinish, form }) => {
  return (
    <Modal title="Create New Poem" open={visible} onCancel={onCancel} footer={null} width={600}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="Enter the title of your poem" />
        </Form.Item>

        <Form.Item name="content" label="Content" rules={[{ required: true }]}>
          <TextArea placeholder="Write your poem here..." autoSize={{ minRows: 6, maxRows: 12 }} />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Select placeholder="Select a category">
            {categories
              .filter((cat) => cat.id !== "all")
              .map((category) => (
                <Option key={category.id} value={category.name}>
                  {category.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="Tags" rules={[{ required: true }]}>
          <Select mode="tags" placeholder="Add tags">
            <Option value="Nature">Nature</Option>
            <Option value="Love">Love</Option>
            <Option value="Life">Life</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Publish Poem
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default NewPoemModal