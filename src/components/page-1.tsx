import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { Database } from "../supabase/database.types";
import { supabaseClient } from "../supabase/supabase-client";

export default function Page1() {
  const codeRef = useRef<HTMLPreElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);
  const [posts, setPosts] = useState<
    Database["public"]["Tables"]["posts"]["Row"][]
  >([]);

  const getPosts = useCallback(async () => {
    const { data, error } = await supabaseClient.from("posts").select("*");
    if (error) {
      alert(error.message);
    } else {
      setPosts(data);
    }
  }, []);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const afterOp = useCallback(
    (res: PostgrestSingleResponse<null>) => {
      codeRef.current!.innerHTML += `<pre>${JSON.stringify(res)}</pre>`;
      if (!res.error) {
        getPosts();
      }
    },
    [getPosts]
  );
  const addPost = useCallback(async () => {
    const title = titleRef.current?.value;
    const content = contentRef.current?.value;
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    const res = await supabaseClient.from("posts").insert([
      {
        title: title,
        content: content,
        user_id: user!.id,
        user_email: user!.email,
      },
    ]);
    afterOp(res);
  }, [afterOp]);

  const deletePost = useCallback(
    async (post: Database["public"]["Tables"]["posts"]["Row"]) => {
      const res = await supabaseClient.from("posts").delete().eq("id", post.id);
      afterOp(res);
    },
    [afterOp]
  );

  const updatePost = useCallback(
    async (post: Database["public"]["Tables"]["posts"]["Row"]) => {
      const title = titleRef.current?.value;
      const content = contentRef.current?.value;
      const res = await supabaseClient
        .from("posts")
        .update({ title: title, content: content })
        .eq("id", post.id);
      afterOp(res);
    },
    [afterOp]
  );
  return (
    <div>
      <h1>Page 1</h1>
      <h3>操作数据</h3>
      <input type="text" placeholder="title" ref={titleRef} />
      <input type="text" placeholder="content" ref={contentRef} />
      <h3 style={{ display: "flex", gap: "10px" }}>
        表数据(posts)
        <button onClick={addPost}>添加</button>
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto auto",
          gridGap: "10px",
        }}
      >
        <div>user_email</div>
        <div>title</div>
        <div>content</div>
        <div>op</div>
        {posts.map((post) => (
          <Fragment key={post.id}>
            <div>{post.user_email}</div>
            <div>{post.title}</div>
            <div>{post.content}</div>
            <div>
              <button onClick={() => deletePost(post)}>删除</button>
              <button onClick={() => updatePost(post)}>修改</button>
            </div>
          </Fragment>
        ))}
      </div>
      <h3 style={{ display: "flex", gap: "10px" }}>
        <span>请求结果</span>
        <button onClick={() => (codeRef.current!.textContent = "")}>
          清空
        </button>
      </h3>
      <code ref={codeRef}></code>
    </div>
  );
}
